import * as THREE from 'three';

export function createCarModel(colorHex: number, type: 'cruiser' | 'sprinter' | 'tank' = 'cruiser'): THREE.Group {
  switch (type) {
    case 'sprinter': return createSprinterModel(colorHex);
    case 'tank': return createTankModel(colorHex);
    case 'cruiser':
    default:
      return createCruiserModel(colorHex);
  }
}

function createCruiserModel(colorHex: number): THREE.Group {
  const outerGroup = new THREE.Group();
  const group = new THREE.Group();
  
  // Materials that look like polished clay/plastic
  const bodyMat = new THREE.MeshPhysicalMaterial({ 
      color: colorHex, 
      roughness: 0.1, 
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.2
  });
  
  const glassMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x111111, 
      roughness: 0.05, 
      metalness: 0.9,
      transparent: true,
      opacity: 0.8,
      clearcoat: 1.0
  });

  const tireMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.1 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4, metalness: 0.5 });
  const darkTrimMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.2 });
  
  // --- CHASSIS (Main Body) - Sleek elongated teardrop/pill ---
  const bodyGeo = new THREE.SphereGeometry(1.5, 32, 32);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.scale.set(1.1, 0.5, 2.2); // stretch it out
  body.position.set(0, 1.0, 0.2);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // --- FRONT BUMPER ---
  const bumperGeo = new THREE.CapsuleGeometry(0.4, 2.0, 16, 16);
  const bumper = new THREE.Mesh(bumperGeo, trimMat);
  bumper.rotation.z = Math.PI / 2;
  bumper.position.set(0, 0.7, -3.1);
  bumper.castShadow = true;
  group.add(bumper);

  const bumperConnect = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.8, 16), darkTrimMat);
  bumperConnect.rotation.x = Math.PI / 2;
  bumperConnect.position.set(0, 0.8, -2.8);
  group.add(bumperConnect);

  // --- CABIN (Glass Dome) ---
  const cabinGeo = new THREE.SphereGeometry(1.0, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const cabin = new THREE.Mesh(cabinGeo, glassMat);
  cabin.scale.set(0.9, 0.8, 1.2);
  cabin.position.set(0, 1.45, -0.2);
  cabin.castShadow = true;
  group.add(cabin);
  
  // Cabin Rim
  const cabinRimGeo = new THREE.TorusGeometry(1.0, 0.08, 16, 32);
  const cabinRim = new THREE.Mesh(cabinRimGeo, darkTrimMat);
  cabinRim.rotation.x = Math.PI / 2;
  cabinRim.scale.set(0.9, 1.2, 1);
  cabinRim.position.set(0, 1.45, -0.2);
  group.add(cabinRim);

  // --- SPOILER ---
  const spoilerWingGeo = new THREE.CapsuleGeometry(0.2, 2.4, 16, 16);
  const spoilerWing = new THREE.Mesh(spoilerWingGeo, trimMat);
  spoilerWing.rotation.z = Math.PI / 2;
  spoilerWing.position.set(0, 2.2, 2.8);
  spoilerWing.castShadow = true;
  group.add(spoilerWing);
  
  const strutGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
  const strutL = new THREE.Mesh(strutGeo, darkTrimMat);
  strutL.position.set(-0.8, 1.8, 2.7);
  strutL.rotation.x = -0.2;
  strutL.castShadow = true;
  
  const strutR = new THREE.Mesh(strutGeo, darkTrimMat);
  strutR.position.set(0.8, 1.8, 2.7);
  strutR.rotation.x = -0.2;
  strutR.castShadow = true;
  group.add(strutL, strutR);

  // --- WHEELS ---
  const wGeo = new THREE.TorusGeometry(0.5, 0.25, 16, 32); // chunky tires
  const hubGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);

  [
      [-1.4, 0.75, -1.8], [ 1.4, 0.75, -1.8], // Front
      [-1.5, 0.75,  2.0], [ 1.5, 0.75,  2.0]  // Rear (slightly wider)
  ].forEach((p, idx) => {
      const wGrp = new THREE.Group();
      
      const tire = new THREE.Mesh(wGeo, tireMat);
      tire.rotation.y = Math.PI / 2;
      tire.castShadow = true;
      wGrp.add(tire);

      const hub = new THREE.Mesh(hubGeo, trimMat);
      hub.rotation.z = Math.PI / 2;
      wGrp.add(hub);
      
      // Add cute colored dot in wheel center
      const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.32, 16), bodyMat);
      dot.rotation.z = Math.PI / 2;
      wGrp.add(dot);

      wGrp.position.set(p[0], p[1], p[2]);
      
      // scale rear wheels up slightly
      if (idx >= 2) {
         wGrp.scale.set(1.2, 1.2, 1.2);
         wGrp.position.y += 0.15; // adjust for scale
      }
      group.add(wGrp);
  });
  
  // --- HEADLIGHTS ---
  const headGrp = new THREE.Group();
  const hlGeo = new THREE.SphereGeometry(0.25, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.0 });
  const hlRingGeo = new THREE.TorusGeometry(0.25, 0.05, 16, 32);
  
  [-0.6, 0.6].forEach(x => {
      const hl = new THREE.Mesh(hlGeo, headMat);
      hl.scale.z = 0.5;
      const ring = new THREE.Mesh(hlRingGeo, trimMat);
      hl.add(ring);
      hl.position.set(x, 1.0, -3.1);
      // angle them forward/up
      hl.rotation.x = -Math.PI/8;
      headGrp.add(hl);
  });
  group.add(headGrp);

  // --- TAIL LIGHTS ---
  const tailGrp = new THREE.Group();
  const tlGeo = new THREE.CapsuleGeometry(0.15, 0.6, 16, 16);
  const tailMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 1.0 });
  
  [-0.7, 0.7].forEach(x => {
      const tl = new THREE.Mesh(tlGeo, tailMat);
      tl.rotation.z = Math.PI / 2;
      tl.position.set(x, 1.2, 3.4);
      tailGrp.add(tl);
  });
  group.add(tailGrp);

  // --- EXHAUST ---
  const exhaustGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.4, 16);
  const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
  
  [-0.3, 0.3].forEach(x => {
      const ex = new THREE.Mesh(exhaustGeo, exhaustMat);
      ex.rotation.x = Math.PI / 2;
      ex.position.set(x, 0.8, 3.5);
      
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.41, 16), new THREE.MeshBasicMaterial({color: 0x000000}));
      hole.rotation.x = -Math.PI / 2;
      ex.add(hole);
      
      group.add(ex);
  });

  group.position.y = -0.75;
  outerGroup.add(group);
  return outerGroup;
}

function getMaterials(colorHex: number) {
  return {
    bodyMat: new THREE.MeshPhysicalMaterial({ 
        color: colorHex, 
        roughness: 0.2, 
        metalness: 0.1, 
        clearcoat: 1.0, 
        clearcoatRoughness: 0.1 
    }),
    glassMat: new THREE.MeshPhysicalMaterial({ 
        color: 0x111122, 
        roughness: 0.05, 
        metalness: 0.9, 
        transparent: true, 
        opacity: 0.9, 
        clearcoat: 1.0,
        envMapIntensity: 2.0
    }),
    tireMat: new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a, 
        roughness: 0.8, 
        metalness: 0.1 
    }),
    trimMat: new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.2, 
        metalness: 0.3 
    }),
    darkTrimMat: new THREE.MeshStandardMaterial({ 
        color: 0x222222, 
        roughness: 0.6, 
        metalness: 0.5 
    })
  };
}

function createSprinterModel(colorHex: number): THREE.Group {
  const outerGroup = new THREE.Group();
  const group = new THREE.Group();
  const m = getMaterials(colorHex);

  // Chassis - sharp wedge
  const bodyGeo = new THREE.BoxGeometry(2.2, 0.6, 4.4);
  const pos = bodyGeo.attributes.position as THREE.BufferAttribute;
  for(let i=0; i<pos.count; i++) {
     if (pos.getZ(i) < 0) {
         pos.setY(i, pos.getY(i) - 0.2); 
         pos.setX(i, pos.getX(i) * 0.7);  
     } else {
         pos.setY(i, pos.getY(i) + 0.1); 
     }
  }
  bodyGeo.computeVertexNormals();
  const body = new THREE.Mesh(bodyGeo, m.bodyMat);
  body.position.set(0, 0.8, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Cabin - low profile
  const cabinGeo = new THREE.BoxGeometry(1.6, 0.5, 2.0);
  const cpos = cabinGeo.attributes.position as THREE.BufferAttribute;
  for(let i=0; i<cpos.count; i++) {
     if (cpos.getZ(i) < 0) { 
        cpos.setY(i, cpos.getY(i) - 0.2); 
        cpos.setZ(i, cpos.getZ(i) + 0.5);
        cpos.setX(i, cpos.getX(i) * 0.8);
     } else {
        cpos.setY(i, cpos.getY(i) - 0.1); 
        cpos.setZ(i, cpos.getZ(i) - 0.2);
     }
  }
  cabinGeo.computeVertexNormals();
  const cabin = new THREE.Mesh(cabinGeo, m.glassMat);
  cabin.position.set(0, 1.35, -0.2);
  cabin.castShadow = true;
  group.add(cabin);

  // Big spoiler
  const spGeo = new THREE.BoxGeometry(2.4, 0.1, 0.6);
  const sp = new THREE.Mesh(spGeo, m.bodyMat);
  sp.position.set(0, 1.6, 2.0);
  sp.castShadow = true;
  group.add(sp);
  const strutGeo = new THREE.BoxGeometry(0.1, 0.5, 0.3);
  const stL = new THREE.Mesh(strutGeo, m.darkTrimMat);
  stL.position.set(-0.8, 1.35, 2.0);
  const stR = new THREE.Mesh(strutGeo, m.darkTrimMat);
  stR.position.set(0.8, 1.35, 2.0);
  group.add(stL, stR);

  // Wheels
  const wGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.3, 16);
  wGeo.rotateZ(Math.PI / 2);
  [
      [-1.3, 0.55, -1.4], [1.3, 0.55, -1.4],
      [-1.4, 0.65, 1.5], [1.4, 0.65, 1.5]
  ].forEach((p, idx) => {
      const tire = new THREE.Mesh(wGeo, m.tireMat);
      tire.castShadow = true;
      tire.position.set(p[0], p[1], p[2]);
      if (idx >= 2) tire.scale.set(1.1, 1, 1.1); // larger rear tires
      group.add(tire);
  });
  
  group.position.y = -0.55;
  outerGroup.add(group);
  return outerGroup;
}

function createTankModel(colorHex: number): THREE.Group {
  const outerGroup = new THREE.Group();
  const group = new THREE.Group();
  const m = getMaterials(colorHex);

  // Chassis - blocky and tall
  const bodyGeo = new THREE.BoxGeometry(2.8, 1.4, 4.6);
  const pos = bodyGeo.attributes.position as THREE.BufferAttribute;
  for(let i=0; i<pos.count; i++) {
     if (pos.getZ(i) < 0 && pos.getY(i) > 0) {
         pos.setZ(i, pos.getZ(i) + 0.3); // slight slope front
     }
  }
  bodyGeo.computeVertexNormals();
  const body = new THREE.Mesh(bodyGeo, m.bodyMat);
  body.position.set(0, 1.2, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Cabin - square
  const cabinGeo = new THREE.BoxGeometry(2.2, 0.8, 1.8);
  const cabin = new THREE.Mesh(cabinGeo, m.glassMat);
  cabin.position.set(0, 2.3, 0);
  cabin.castShadow = true;
  group.add(cabin);

  // Roof rack
  const rackGeo = new THREE.BoxGeometry(2.0, 0.1, 1.6);
  const rack = new THREE.Mesh(rackGeo, m.darkTrimMat);
  rack.position.set(0, 2.75, 0);
  group.add(rack);

  // Wheels - enormous
  const wGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 16);
  wGeo.rotateZ(Math.PI / 2);
  [
      [-1.8, 0.8, -1.4], [1.8, 0.8, -1.4],
      [-1.8, 0.8, 1.4], [1.8, 0.8, 1.4]
  ].forEach(p => {
      const tire = new THREE.Mesh(wGeo, m.tireMat);
      tire.castShadow = true;
      tire.position.set(p[0], p[1], p[2]);
      group.add(tire);
  });
  
  group.position.y = -0.8;
  outerGroup.add(group);
  return outerGroup;
}
