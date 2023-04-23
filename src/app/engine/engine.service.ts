import { WindowRefService } from './../services/window-ref.service';
import {ElementRef, Injectable, NgZone} from '@angular/core';
import {
  Engine,
  FreeCamera,
  Scene,
  Light,
  Mesh,
  Color3,
  Color4,
  Vector3,
  HemisphericLight,
  StandardMaterial,
  Texture,
  DynamicTexture,
  Space,
  MeshBuilder,
  Material
} from '@babylonjs/core';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas!: HTMLCanvasElement;
  private engine!: Engine;
  private camera!: FreeCamera;
  private scene!: Scene;
  private light!: Light;

  private ground!: Mesh;

  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService
  ) {}

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new Engine(this.canvas,  true);

    // create a basic BJS Scene object
    this.scene = new Scene(this.engine);
    //this.scene.clearColor = Color4.FromColor3(Color3.Green());

    // create a FreeCamera, and set its position to (x:5, y:10, z:-20 )
    this.camera = new FreeCamera('camera1', new Vector3(0, 25, 0), this.scene);

    // target the camera to scene origin
    this.camera.setTarget(Vector3.Zero());

    // attach the camera to the canvas
    this.camera.attachControl(this.canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
    this.light.intensity = 0.5;
    // create a built-in "sphere" shape; its constructor takes 4 params: name, subdivisions, radius, scene
    this.ground = MeshBuilder.CreateGround('ground1',{width: 15, height: 20}, this.scene);

    // generates the world x-y-z axis for better understanding
    // this.showWorldAxis(8);
  }

  public generateBox(size?:number, width?:number, height?:number, x?:number, y?:number, z?:number){
    let box = MeshBuilder.CreateBox("box1",{size: size??1, width: width??1, height: height??1})
    let boxMaterial = new StandardMaterial("Ground Material", this.scene);
    boxMaterial.diffuseColor = Color3.Random();
    box.material = boxMaterial;
    box.position.x = x ?? 1;
    box.position.z = z ?? 1;
    box.position.y = y ?? .5;
    
  }

  public generateGround(width?:number, height?:number, x?:number, y?:number, z?:number){
    let ground = MeshBuilder.CreateGround('ground2',{width: width, height: height}, this.scene);
    let groundMaterial = new StandardMaterial("Ground Material", this.scene);
    groundMaterial.diffuseColor = Color3.Blue();
    ground.material = groundMaterial;
    ground.position.x = x ?? 1;
    ground.position.z = z ?? 1;
    ground.position.y = y ?? .5;
  }
  

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        this.scene.render();
      };

      if (this.windowRef.document.readyState !== 'loading') {
        this.engine.runRenderLoop(rendererLoopCallback);
      } else {
        this.windowRef.window.addEventListener('DOMContentLoaded', () => {
          this.engine.runRenderLoop(rendererLoopCallback);
        });
      }

      this.windowRef.window.addEventListener('resize', () => {
        this.engine.resize();
      });
    });
  }

  /**
   * creates the world axes
   *
   * Source: https://doc.babylonjs.com/snippets/world_axes
   *
   * @param size number
   */
  public showWorldAxis(size: number): void {

    const makeTextPlane = (text: string, color: string, textSize: number) => {
      const dynamicTexture = new DynamicTexture('DynamicTexture', 50, this.scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color , 'transparent', true);
      const plane = Mesh.CreatePlane('TextPlane', textSize, this.scene, true);
      const material = new StandardMaterial('TextPlaneMaterial', this.scene);
      material.backFaceCulling = false;
      material.specularColor = new Color3(0, 0, 0);
      material.diffuseTexture = dynamicTexture;
      plane.material = material;

      return plane;
    };

    const axisX = MeshBuilder.CreateLines(
      'axisX',
      {
        points: [
          Vector3.Zero(),
          new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
          new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
        ],
        updatable: true
      },
      this.scene,
    );

    axisX.color = new Color3(1, 0, 0);
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

    const axisY = MeshBuilder.CreateLines(
      'axisY',
      {
        points: [
          Vector3.Zero(), new Vector3(0, size, 0), new Vector3( -0.05 * size, size * 0.95, 0),
          new Vector3(0, size, 0), new Vector3( 0.05 * size, size * 0.95, 0)
        ],
        updatable: true
      },
      this.scene,
    );

    axisY.color = new Color3(0, 1, 0);
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

    const axisZ = MeshBuilder.CreateLines(
      'axisZ',
      {
        points: [
          Vector3.Zero(), new Vector3(0, 0, size), new Vector3( 0 , -0.05 * size, size * 0.95),
          new Vector3(0, 0, size), new Vector3( 0, 0.05 * size, size * 0.95)
        ],
        updatable: true
      },
      this.scene,
    );

    axisZ.color = new Color3(0, 0, 1);
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
  }
}
