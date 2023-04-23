import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.scss']
})
export class EngineComponent implements OnInit {

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: EngineService) { }

  public ngOnInit(): void {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();
    this.createShelf();
    this.engServ.generateGround(1,1,-5.5,.001,-9.5);
    this.engServ.generateGround(1,1,-3.5,.001,-9.5);
    this.engServ.generateGround(1,1,-1.5,.001,-9.5);
    this.engServ.generateGround(1,1,.5,.001,-9.5);
    this.engServ.generateGround(1,1,2.5,.001,-9.5);
    this.engServ.generateGround(1,1,4.5,.001,-9.5);
    this.engServ.generateGround(1,1,6.5,.001,-9.5);
  }

  createShelf(){
    //size, width, height, x, y, z
    for (let y = 0; y < 4; y++) {
      for(let x = 0; x < 9; x++){
        this.engServ.generateBox(1,1,1,4.5,.5+y,-4+x);
        this.engServ.generateBox(1,1,1,2.5,.5+y,-4+x);
        this.engServ.generateBox(1,1,1,1.5,.5+y,-4+x);
        this.engServ.generateBox(1,1,1,-.5,.5+y,-4+x);
        this.engServ.generateBox(1,1,1,-1.5,.5+y,-4+x);
        this.engServ.generateBox(1,1,1,-3.5,.5+y,-4+x);
      }      
    }
  }

}