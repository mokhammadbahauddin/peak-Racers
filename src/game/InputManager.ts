export class InputManager {
  keys: Record<string, boolean> = { 
      ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, 
      w: false, a: false, s: false, d: false, 
      W: false, A: false, S: false, D: false, 
      Shift: false, r: false, R: false, ' ': false, 
      e: false, E: false,
      z: false, Z: false, x: false, X: false
  };

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
    
    // Support lowercase fallbacks for caps lock issues
    const key = e.key;
    const lowerKey = key.length === 1 ? key.toLowerCase() : key;
    
    if (key in this.keys) this.keys[key] = true;
    if (lowerKey in this.keys) this.keys[lowerKey] = true;
  }

  private handleKeyUp(e: KeyboardEvent) {
    const key = e.key;
    const lowerKey = key.length === 1 ? key.toLowerCase() : key;
    
    if (key in this.keys) this.keys[key] = false;
    if (lowerKey in this.keys) this.keys[lowerKey] = false;
  }

  private handleBlur() {
      // Reset all keys to false when window loses focus
      for (const k in this.keys) {
          this.keys[k] = false;
      }
  }

  public simulateKey(key: string, state: boolean) {
    if(key in this.keys) this.keys[key] = state;
  }

  private activeGamepad: Gamepad | null = null;
  
  private steerCurrent = 0;

  public update(dt: number = 0.016) {
    this.activeGamepad = null;
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && gamepads[i]!.mapping === 'standard') {
            this.activeGamepad = gamepads[i];
            break;
        }
    }
    if (!this.activeGamepad) {
        this.activeGamepad = (gamepads[0] as Gamepad) || null;
    }
  }

  private getGamepad(): Gamepad | null {
    return this.activeGamepad;
  }

  public analogInputs: Record<string, number> = { steer: null, gas: null };

  public setAnalogSteer(val: number | null) { this.analogInputs.steer = val; }
  public setAnalogGas(val: number | null) { this.analogInputs.gas = val; }

  public getGas(): number {
    if (this.analogInputs.gas !== null) return this.analogInputs.gas;
    
    let gas = 0;
    if (this.keys.ArrowUp || this.keys.w || this.keys.W) gas = 1;
    else if (this.keys.ArrowDown || this.keys.s || this.keys.S) gas = -0.5;

    const gp = this.getGamepad();
    if (gp) {
        // R2 (accelerate) / L2 (brake/reverse) on standard gamepads
        if (gp.buttons[7] && gp.buttons[7].value > 0.1) gas = gp.buttons[7].value;
        else if (gp.buttons[6] && gp.buttons[6].value > 0.1) gas = -gp.buttons[6].value * 0.5;
        // fallback to D-pad up/down or Right trigger if mapping is weird
        if (gp.buttons[12] && gp.buttons[12].pressed) gas = 1;
        if (gp.buttons[13] && gp.buttons[13].pressed) gas = -0.5;
    }
    return gas;
  }

  public getSteer(dt: number = 0.016): number {
    if (this.analogInputs.steer !== null) {
        this.steerCurrent = this.analogInputs.steer;
        return this.steerCurrent; // Direct pass-through for JS joysticks
    }

    let steerTarget = 0;
    if (this.keys.ArrowLeft || this.keys.a || this.keys.A) steerTarget = -1;
    else if (this.keys.ArrowRight || this.keys.d || this.keys.D) steerTarget = 1;

    const gp = this.getGamepad();
    if (gp) {
        const axisX = gp.axes[0];
        if (Math.abs(axisX) > 0.15) { // slightly bigger deadzone
            steerTarget = axisX;
        }
        if (gp.buttons[14] && gp.buttons[14].pressed) steerTarget = -1;
        if (gp.buttons[15] && gp.buttons[15].pressed) steerTarget = 1;
    }
    
    // Smooth interpolation (approx ~0.15s to max steering)
    const steerSpeed = 6.0;
    if (this.steerCurrent < steerTarget) {
        this.steerCurrent = Math.min(steerTarget, this.steerCurrent + steerSpeed * dt);
    } else if (this.steerCurrent > steerTarget) {
        this.steerCurrent = Math.max(steerTarget, this.steerCurrent - steerSpeed * dt);
    }

    return this.steerCurrent;
  }

  public isBoosting(): boolean {
    let boost = this.keys.Shift;
    const gp = this.getGamepad();
    if (gp) {
        // A button (bottom face button) or B button (right face button)
        if ((gp.buttons[0] && gp.buttons[0].pressed) || (gp.buttons[1] && gp.buttons[1].pressed)) {
            boost = true;
        }
    }
    return boost;
  }
  
  public isDrifting(): boolean {
    let drift = this.keys[' '];
    const gp = this.getGamepad();
    if (gp) {
        // R1 / R Bumper
        if (gp.buttons[5] && gp.buttons[5].pressed) {
            drift = true;
        }
    }
    return drift;
  }

  public isItemPressed(): boolean {
    let item = this.keys.e || this.keys.E;
    const gp = this.getGamepad();
    if (gp) {
        // L1 (button 4)
        if ((gp.buttons[4] && gp.buttons[4].pressed)) {
            item = true;
        }
    }
    return item;
  }

  public isReset(): boolean {
    let r = this.keys.r || this.keys.R;
    const gp = this.getGamepad();
    if (gp) {
        // Select/Back (button 8) or Start (button 9)
        if ((gp.buttons[8] && gp.buttons[8].pressed) || (gp.buttons[9] && gp.buttons[9].pressed)) {
            r = true;
        }
    }
    return r;
  }

  public dispose() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
  }
}
