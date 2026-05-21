import * as THREE from 'three';
import { TrackDefinition } from './tracks/TrackData';

export class TrackGenerator {
  curve: THREE.CatmullRomCurve3;
  trackMesh!: THREE.Mesh;
  trackPositions: number[] = [];
  trackIndices: number[] = [];
  sceneryGroup: THREE.Group;
  animatedScenery: any[] = [];
  itemBoxes: { mesh: THREE.Group, position: THREE.Vector3, active: boolean, id: number }[] = [];
  physicsProps: { type: 'barrier' | 'tree' | 'sign' | 'flag', position: THREE.Vector3, quaternion: THREE.Quaternion, scale?: any }[] = [];
  pathLength: number;
  roadWidth: number;
  up = new THREE.Vector3(0, 1, 0);
  trackData: TrackDefinition;

  constructor(scene: THREE.Scene, trackData: TrackDefinition) {
    this.trackData = trackData;
    this.roadWidth = trackData.roadWidth;

    const trackPoints = trackData.points.map(p => new THREE.Vector3(p[0], p[1], p[2]).multiplyScalar(2));

    this.curve = new THREE.CatmullRomCurve3(trackPoints, true);
    this.curve.curveType = 'catmullrom';
    this.curve.tension = 0.5;
    this.pathLength = this.curve.getLength();
    
    this.sceneryGroup = new THREE.Group();

    this.buildTrack(scene);
    this.buildScenery(scene);
  }

  private createTrackTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = this.trackData.colors.base;
        ctx.fillRect(0,0,512,512);
        
        ctx.fillStyle = this.trackData.colors.stripes; 
        ctx.fillRect(240, 0, 32, 256); 
        
        ctx.fillStyle = this.trackData.colors.rubble1; 
        ctx.fillRect(0, 0, 40, 256);
        ctx.fillRect(512-40, 0, 40, 256);
        
        ctx.fillStyle = this.trackData.colors.rubble2; 
        ctx.fillRect(0, 256, 40, 256);
        ctx.fillRect(512-40, 256, 40, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 160);
    return tex;
  }

  private buildTrack(scene: THREE.Scene) {
    const trackSegments = 800;
    const positions = [];
    const uvs = [];
    const indices = [];
    
    // For curbs/walls
    const wallPositions = [];
    const wallIndices = [];
    const wallUvs = [];

    const wallThickness = 1.5;
    const wallHeight = 1.0;
    const trackDepth = 2.0;

    for (let i = 0; i <= trackSegments; i++) {
        const t = i / trackSegments;
        const pt = this.curve.getPointAt(t);
        const tangent = this.curve.getTangentAt(t).normalize();
        const right = tangent.clone().cross(this.up).normalize();
        
        const leftPt = pt.clone().add(right.clone().multiplyScalar(-this.roadWidth));
        const rightPt = pt.clone().add(right.clone().multiplyScalar(this.roadWidth));
        
        const leftV = pt.clone().add(right.clone().multiplyScalar(-this.roadWidth - wallThickness));
        const rightV = pt.clone().add(right.clone().multiplyScalar(this.roadWidth + wallThickness));

        // Road Surface
        positions.push(leftPt.x, leftPt.y, leftPt.z);
        positions.push(rightPt.x, rightPt.y, rightPt.z);
        uvs.push(0, t); 
        uvs.push(1, t);

        // Under-track depth (bottom face left/right)
        const leftDepth = leftV.clone().add(new THREE.Vector3(0, -trackDepth, 0));
        const rightDepth = rightV.clone().add(new THREE.Vector3(0, -trackDepth, 0));

        // Curb tops
        const leftTop = leftV.clone().add(new THREE.Vector3(0, wallHeight, 0));
        const leftInner = leftPt.clone().add(new THREE.Vector3(0, wallHeight, 0));

        const rightTop = rightV.clone().add(new THREE.Vector3(0, wallHeight, 0));
        const rightInner = rightPt.clone().add(new THREE.Vector3(0, wallHeight, 0));

        // Push wall vertices (simple outer rim extrusion)
        // Left Curb
        wallPositions.push(leftInner.x, leftInner.y, leftInner.z); // 0
        wallPositions.push(leftTop.x, leftTop.y, leftTop.z);       // 1
        wallPositions.push(leftV.x, leftV.y, leftV.z);             // 2
        wallPositions.push(leftDepth.x, leftDepth.y, leftDepth.z); // 3

        // Right Curb
        wallPositions.push(rightInner.x, rightInner.y, rightInner.z); // 4
        wallPositions.push(rightTop.x, rightTop.y, rightTop.z);       // 5
        wallPositions.push(rightV.x, rightV.y, rightV.z);             // 6
        wallPositions.push(rightDepth.x, rightDepth.y, rightDepth.z); // 7

        const wt = t * trackSegments * 0.1; // frequency of curb stripes
        for(let j=0; j<8; j++) { wallUvs.push(j%2, wt); }
    }

    // Build Indices
    for (let i = 0; i < trackSegments; i++) {
        // Road indices
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, b, d);
        indices.push(a, d, c);

        // Wall indices
        const wa = i * 8;
        const wb = wa + 8;
        
        // Left curb top
        wallIndices.push(wa+0, wa+1, wb+1); wallIndices.push(wa+0, wb+1, wb+0);
        // Left curb outer
        wallIndices.push(wa+1, wa+2, wb+2); wallIndices.push(wa+1, wb+2, wb+1);
        // Left curb wall down
        wallIndices.push(wa+2, wa+3, wb+3); wallIndices.push(wa+2, wb+3, wb+2);

        // Right curb top
        wallIndices.push(wa+4, wb+5, wa+5); wallIndices.push(wa+4, wb+4, wb+5);
        // Right curb outer
        wallIndices.push(wa+5, wb+6, wa+6); wallIndices.push(wa+5, wb+5, wb+6);
        // Right curb wall down
        wallIndices.push(wa+6, wb+7, wa+7); wallIndices.push(wa+6, wb+6, wb+7);
    }

    // Offset wall indices for combined physics mesh
    const indexOffset = positions.length / 3;
    const combinedPositions = [...positions, ...wallPositions];
    const combinedIndices = [...indices, ...wallIndices.map(idx => idx + indexOffset)];

    this.trackPositions = combinedPositions;
    this.trackIndices = combinedIndices;

    // Road Mesh
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    this.trackMesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
       map: this.createTrackTexture(),
       roughness: 1.0,
       metalness: 0.0,
       side: THREE.DoubleSide,
    }));
    this.trackMesh.receiveShadow = true;
    scene.add(this.trackMesh);

    // Curb Mesh (Checkerboard or solid trim)
    const wallGeo = new THREE.BufferGeometry();
    wallGeo.setAttribute('position', new THREE.Float32BufferAttribute(wallPositions, 3));
    wallGeo.setAttribute('uv', new THREE.Float32BufferAttribute(wallUvs, 2));
    wallGeo.setIndex(wallIndices);
    wallGeo.computeVertexNormals();
    
    // Create simple procedural checker strip for curbs
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
       ctx.fillStyle = '#ff6b6b'; ctx.fillRect(0,0,64,64); // red
       ctx.fillStyle = '#ffffff'; ctx.fillRect(0,64,64,64); // white
    }
    const trimTex = new THREE.CanvasTexture(canvas);
    trimTex.needsUpdate = true;
    trimTex.wrapS = trimTex.wrapT = THREE.RepeatWrapping;

    const wallMesh = new THREE.Mesh(wallGeo, new THREE.MeshStandardMaterial({
       map: trimTex,
       roughness: 0.8,
       metalness: 0.1,
       side: THREE.FrontSide
    }));
    wallMesh.receiveShadow = true;
    scene.add(wallMesh);

    // Start/Finish Line
    const finishPos = this.curve.getPointAt(0);
    const finishTangent = this.curve.getTangentAt(0).normalize();
    const finishRight = finishTangent.clone().cross(this.up).normalize();
    
    const finishGeo = new THREE.PlaneGeometry(this.roadWidth * 2.2, 8);
    
    // Procedural checkerboard texture for finish line
    const fc = document.createElement('canvas');
    fc.width = 256; fc.height = 64;
    const fctx = fc.getContext('2d');
    if (fctx) {
        fctx.fillStyle = '#ffffff'; fctx.fillRect(0,0,256,64);
        fctx.fillStyle = '#111111';
        for(let j=0; j<2; j++) {
            for(let k=0; k<16; k++) {
                if ((j+k)%2 === 0) fctx.fillRect(k*16, j*32, 16, 32);
            }
        }
    }
    const finishTex = new THREE.CanvasTexture(fc);
    finishTex.wrapS = THREE.RepeatWrapping; finishTex.wrapT = THREE.RepeatWrapping;
    finishTex.repeat.set(4, 1);
    
    const finishMat = new THREE.MeshBasicMaterial({ map: finishTex, transparent: true, opacity: 0.9 });
    const finishLine = new THREE.Mesh(finishGeo, finishMat);
    finishLine.position.copy(finishPos);
    finishLine.position.y += 0.2; // Float slightly above road
    finishLine.lookAt(finishPos.clone().add(this.up));
    finishLine.rotateZ(Math.atan2(finishTangent.z, finishTangent.x)); // Align with road direction
    scene.add(finishLine);

    // Floor Ground Plane / Fog Floor
    const floorGeo = new THREE.PlaneGeometry(3000, 3000, 10, 10);
    const floorMat = new THREE.MeshStandardMaterial({
       color: this.trackData.colors.base,
       roughness: 0.4,
       metalness: 0.1,
       transparent: true, // give it a soft bottom gradient feel
       opacity: 0.7
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -30; // Soft landing floor way below track
    floor.receiveShadow = true;
    scene.add(floor);

    // Racing Line Indicators
    const racingLineGeo = new THREE.PlaneGeometry(4, 4);
    const chevCanvas = document.createElement('canvas');
    chevCanvas.width = 128; chevCanvas.height = 128;
    const chevCtx = chevCanvas.getContext('2d');
    if (chevCtx) {
        chevCtx.fillStyle = 'rgba(0,0,0,0)';
        chevCtx.clearRect(0,0,128,128);
        chevCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        chevCtx.lineWidth = 14;
        chevCtx.lineCap = 'round';
        chevCtx.lineJoin = 'round';
        
        // shadow/glow
        chevCtx.shadowColor = 'rgba(255, 255, 255, 1.0)';
        chevCtx.shadowBlur = 10;

        chevCtx.beginPath();
        chevCtx.moveTo(24, 96);
        chevCtx.lineTo(64, 40);
        chevCtx.lineTo(104, 96);
        chevCtx.stroke();
    }
    const chevTex = new THREE.CanvasTexture(chevCanvas);
    chevTex.anisotropy = 4;
    
    const racingLineMat = new THREE.MeshBasicMaterial({ 
        map: chevTex, 
        transparent: true, 
        opacity: 0.7, 
        depthWrite: false,
        blending: THREE.AdditiveBlending 
    });

    const racingLineCount = 300;
    const racingLineInst = new THREE.InstancedMesh(racingLineGeo, racingLineMat, racingLineCount);
    let rlIdx = 0;
    const rlDummy = new THREE.Object3D();
    const colorObj = new THREE.Color();

    for (let i = 0; i < racingLineCount; i++) {
        const t = i / racingLineCount;
        const pt = this.curve.getPointAt(t);
        const tangent = this.curve.getTangentAt(t).normalize();
        
        // Calculate curvature
        const tPre = Math.max(0, t - 0.02);
        const tPost = Math.min(1, t + 0.02);
        const dot = this.curve.getTangentAt(tPre).dot(this.curve.getTangentAt(tPost)); 
        
        rlDummy.position.copy(pt);
        rlDummy.position.y += 0.3; // Float just above the ground
        
        // Shift it slightly towards the inside of the curve for a more "optimal" racing line feel
        const turningDir = new THREE.Vector3().crossVectors(this.curve.getTangentAt(tPre), this.curve.getTangentAt(tPost));
        const right = tangent.clone().cross(this.up).normalize();
        if (dot < 0.995) {
            // we have a turn, move line left or right depending on turn
            const turnSign = Math.sign(turningDir.y);
            // turningDir.y > 0 means turning left, so move to the inside (left)
            // right is pointing "right", so shift by -right
            rlDummy.position.add(right.clone().multiplyScalar(turnSign * -this.roadWidth * 0.4));
        }

        const nextPt = rlDummy.position.clone().add(tangent);
        rlDummy.lookAt(nextPt);
        rlDummy.rotateX(-Math.PI / 2); // Lay flat on the track
        rlDummy.updateMatrix();
        
        racingLineInst.setMatrixAt(rlIdx, rlDummy.matrix);
        
        // Adaptive coloring
        if (dot > 0.995) {
            colorObj.setHex(0xa4e2f7); // Cyan straight
        } else if (dot > 0.98) {
            colorObj.setHex(0xffd166); // Yellow medium turn
        } else {
            colorObj.setHex(0xffadbc); // Pink/Red sharp turn
        }
        racingLineInst.setColorAt(rlIdx, colorObj);
        
        rlIdx++;
    }
    
    // Add to scenery group
    this.sceneryGroup.add(racingLineInst);
    this.animatedScenery.push({ type: 'racingLine', mesh: racingLineInst, count: racingLineCount });
  }

  private buildScenery(scene: THREE.Scene) {
    const trackSegments = 800;
    
    // Barriers
    const barrierGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 8);
    barrierGeo.rotateZ(Math.PI / 2);
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0xffdad6, roughness: 0.9, flatShading: true });
    
    const barrierCount = Math.floor(trackSegments / 12);
    const barrierInstanced = new THREE.InstancedMesh(barrierGeo, barrierMat, barrierCount);
    barrierInstanced.castShadow = true;
    barrierInstanced.receiveShadow = true;
    let bIdx = 0;
    const dummy = new THREE.Object3D();

    for (let i = 0; i < trackSegments; i += 12) {
        if (Math.random() > this.trackData.props.barrierProbability) continue;
        const t = i / trackSegments;
        const pt = this.curve.getPointAt(t);
        const tangent = this.curve.getTangentAt(t).normalize();
        const right = tangent.clone().cross(this.up).normalize();

        const side = Math.random() > 0.5 ? 1 : -1;
        const pos = pt.clone().add(right.clone().multiplyScalar(side * (this.roadWidth + 3)));
        
        dummy.position.copy(pos);
        dummy.position.y += 1.5;
        dummy.lookAt(pos.clone().add(tangent));
        dummy.updateMatrix();
        barrierInstanced.setMatrixAt(bIdx++, dummy.matrix);
        
        const q = new THREE.Quaternion().setFromRotationMatrix(dummy.matrix);
        this.physicsProps.push({ type: 'barrier', position: dummy.position.clone(), quaternion: q.clone() });
    }
    barrierInstanced.count = bIdx;
    this.sceneryGroup.add(barrierInstanced);

    // Trees
    const treeCount = 250;
    const pineTrunkGeo = new THREE.CylinderGeometry(1, 1.5, 4, 6);
    const pineLeaves1Geo = new THREE.ConeGeometry(5, 8, 6);
    const pineLeaves2Geo = new THREE.ConeGeometry(4, 6, 6);
    const roundTrunkGeo = new THREE.CylinderGeometry(0.8, 1, 3, 6);
    const roundBushyGeo = new THREE.DodecahedronGeometry(4, 0);

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9, flatShading: true });
    const leaf1Mat = new THREE.MeshStandardMaterial({ color: 0xd1e9cd, roughness: 0.8, flatShading: true });
    const leaf2Mat = new THREE.MeshStandardMaterial({ color: 0xb5cdb2, roughness: 0.8, flatShading: true });
    const bushyMat = new THREE.MeshStandardMaterial({ color: 0xbaeafa, roughness: 0.7, flatShading: true });

    const pineTrunkInst = new THREE.InstancedMesh(pineTrunkGeo, trunkMat, treeCount);
    const pine1Inst = new THREE.InstancedMesh(pineLeaves1Geo, leaf1Mat, treeCount);
    const pine2Inst = new THREE.InstancedMesh(pineLeaves2Geo, leaf2Mat, treeCount);
    const roundTrunkInst = new THREE.InstancedMesh(roundTrunkGeo, trunkMat, treeCount);
    const roundBushyInst = new THREE.InstancedMesh(roundBushyGeo, bushyMat, treeCount);

    pineTrunkInst.castShadow = true; pine1Inst.castShadow = true; pine2Inst.castShadow = true;
    roundTrunkInst.castShadow = true; roundBushyInst.castShadow = true;

    let pineIdx = 0;
    let roundIdx = 0;

    for(let i=0; i < treeCount; i++) {
        const t = i / treeCount;
        const pt = this.curve.getPointAt(t);
        const tangent = this.curve.getTangentAt(t).normalize();
        const right = tangent.clone().cross(this.up).normalize();
        
        const side = Math.random() > 0.5 ? 1 : -1;
        const offset = this.roadWidth + 6 + Math.random() * 60;
        const pos = pt.clone().add(right.multiplyScalar(side * offset));
        
        const r = Math.random();
        
        dummy.position.copy(pos);
        dummy.rotation.set((Math.random() - 0.5) * 0.15, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.15);
        dummy.updateMatrix();
        
        const qBase = new THREE.Quaternion().setFromEuler(dummy.rotation);
        let propType: any = null;

        if (r < 0.3) {
            // Pine tree
            propType = 'tree';
            const baseMatrix = dummy.matrix.clone();
            
            dummy.position.set(0, 2, 0);
            dummy.applyMatrix4(baseMatrix);
            dummy.updateMatrix();
            pineTrunkInst.setMatrixAt(pineIdx, dummy.matrix);

            dummy.position.set(0, 6, 0);
            dummy.applyMatrix4(baseMatrix);
            dummy.updateMatrix();
            pine1Inst.setMatrixAt(pineIdx, dummy.matrix);

            dummy.position.set(0, 10, 0);
            dummy.applyMatrix4(baseMatrix);
            dummy.updateMatrix();
            pine2Inst.setMatrixAt(pineIdx, dummy.matrix);
            
            pineIdx++;
        } else if (r < 0.5) {
            // Round tree
            propType = 'tree';
            const baseMatrix = dummy.matrix.clone();

            dummy.position.set(0, 1.5, 0);
            dummy.applyMatrix4(baseMatrix);
            dummy.updateMatrix();
            roundTrunkInst.setMatrixAt(roundIdx, dummy.matrix);

            dummy.position.set(0, 5, 0);
            dummy.applyMatrix4(baseMatrix);
            dummy.updateMatrix();
            roundBushyInst.setMatrixAt(roundIdx, dummy.matrix);
            
            roundIdx++;
        } else if (r < 0.7) {
            // Signboard
            propType = 'sign';
            const mesh = new THREE.Group();
            mesh.position.copy(pos);
            const poleMat = new THREE.MeshStandardMaterial({ color: 0xdcece8, roughness: 0.8, flatShading: true });
            const poleL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 15, 6), poleMat);
            poleL.position.set(-6, 7.5, 0);
            poleL.castShadow = true;
            const poleR = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 15, 6), poleMat);
            poleR.position.set(6, 7.5, 0);
            poleR.castShadow = true;
            const sign = new THREE.Mesh(new THREE.BoxGeometry(14, 6, 1), new THREE.MeshStandardMaterial({ color: 0xffd1dc, roughness: 0.5, flatShading: true }));
            sign.position.set(0, 15, 0);
            sign.castShadow = true;
            mesh.add(poleL, poleR, sign);
            mesh.lookAt(mesh.position.clone().add(tangent));
            
            mesh.rotation.y += Math.random() * Math.PI * 0.1;
            mesh.rotation.x += (Math.random() - 0.5) * 0.15;
            mesh.rotation.z += (Math.random() - 0.5) * 0.15;
            this.sceneryGroup.add(mesh);
        } else {
            // Flag
            propType = 'flag';
            const mesh = new THREE.Group();
            mesh.position.copy(pos);
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12, 6), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, flatShading: true }));
            pole.position.y = 6;
            pole.castShadow = true;
            mesh.add(pole);

            const flagMat = new THREE.MeshStandardMaterial({ color: 0xe7bbc6, side: THREE.DoubleSide, roughness: 0.6, flatShading: true });
            const flag = new THREE.Mesh(new THREE.PlaneGeometry(4, 2.5, 4, 3), flagMat);
            flag.geometry.translate(2, 0, 0);
            flag.position.set(0, 10.5, 0);
            flag.castShadow = true;
            mesh.add(flag);

            mesh.rotation.y = Math.random() * Math.PI * 2;
            mesh.rotation.x = (Math.random() - 0.5) * 0.15;
            mesh.rotation.z = (Math.random() - 0.5) * 0.15;
            this.sceneryGroup.add(mesh);

            this.animatedScenery.push({ type: 'flag', mesh: flag, offset: Math.random() * 10 });
        }
        
        if (propType) {
            this.physicsProps.push({ type: propType, position: pos.clone(), quaternion: qBase });
        }
    }

    pineTrunkInst.count = pineIdx;
    pine1Inst.count = pineIdx;
    pine2Inst.count = pineIdx;
    roundTrunkInst.count = roundIdx;
    roundBushyInst.count = roundIdx;

    this.sceneryGroup.add(pineTrunkInst, pine1Inst, pine2Inst, roundTrunkInst, roundBushyInst);
    
    // Item Boxes
    const itemBoxGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const itemBoxMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xaa55ff,
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1.0,
    });
    const innerBoxGeo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    const innerBoxMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    for (let i = 0; i < 25; i++) {
        const t = (i / 25 + Math.random() * 0.05) % 1.0;
        const pt = this.curve.getPointAt(t);
        const tangent = this.curve.getTangentAt(t).normalize();
        const right = tangent.clone().cross(this.up).normalize();
        
        // Randomly place slightly off-center
        const offset = (Math.random() - 0.5) * this.roadWidth * 1.2;
        const pos = pt.clone().add(right.multiplyScalar(offset));
        pos.y += 2.0; // Float above ground
        
        const mesh = new THREE.Group();
        const outerBox = new THREE.Mesh(itemBoxGeo, itemBoxMat);
        const innerBox = new THREE.Mesh(innerBoxGeo, innerBoxMat);
        mesh.add(outerBox, innerBox);
        mesh.position.copy(pos);
        
        this.sceneryGroup.add(mesh);
        
        // Add to array for collision detection
        this.itemBoxes.push({
            mesh,
            position: pos,
            active: true,
            id: i
        });
    }

    // Wind particles
    const windGeo = new THREE.TetrahedronGeometry(0.6, 0);
    const windMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    for(let i=0; i<80; i++) {
        const windp = new THREE.Mesh(windGeo, windMat);
        windp.position.set((Math.random()-0.5)*400, Math.random()*30+5, (Math.random()-0.5)*400);
        this.animatedScenery.push({ type: 'wind', mesh: windp, speedX: Math.random()*15+15, speedY: (Math.random()-0.5)*2 });
        this.sceneryGroup.add(windp);
    }

    scene.add(this.sceneryGroup);
  }

  animateScenery(now: number, dt: number) {
    this.animatedScenery.forEach(anim => {
      if (anim.type === 'flag') {
          const wave = Math.sin(now * 0.003 + anim.offset) * 0.3;
          anim.mesh.rotation.y = wave;
          const posAttr = anim.mesh.geometry.attributes.position;
          for (let i = 0; i < posAttr.count; i++) {
              const x = posAttr.getX(i);
              const w = Math.sin(now * 0.01 + x * 2 + anim.offset) * 0.2 * (x / 4);
              posAttr.setZ(i, w);
          }
          posAttr.needsUpdate = true;
      } else if (anim.type === 'wind') {
          anim.mesh.position.x -= anim.speedX * dt;
          anim.mesh.position.y += anim.speedY * dt;
          anim.mesh.rotation.x += dt;
          anim.mesh.rotation.y += dt;
          if (anim.mesh.position.x < -200) anim.mesh.position.x = 200;
          if (anim.mesh.position.y < 0) anim.mesh.position.y = 30;
          if (anim.mesh.position.y > 35) anim.mesh.position.y = 5;
      } else if (anim.type === 'racingLine') {
          const wave = Math.sin(now * 0.005) * 0.3 + 0.6; // pulse opacity
          if (anim.mesh.material) {
              anim.mesh.material.opacity = wave;
          }
      }
    });
  }
}
