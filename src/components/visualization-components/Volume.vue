<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref, watch} from 'vue';
import '@kitware/vtk.js/Rendering/Profiles/Volume';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkVolume          from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper    from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkRenderWindow    from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import vtkRenderer        from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkImageData  from '@kitware/vtk.js/Common/DataModel/ImageData'

import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import vtkImageSlice from '@kitware/vtk.js/Rendering/Core/ImageSlice';
import vtkImageResliceMapper from '@kitware/vtk.js/Rendering/Core/ImageResliceMapper';
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';
import { SlabTypes } from '@kitware/vtk.js/Rendering/Core/ImageResliceMapper/Constants';
import { TransformCorrection } from './Slicer.vue';

import { zScoreInterpolator } from '../../utils/d3Utils';
import { applyInterpolator } from '../../utils/vtkUtils';

const vtkContainer = ref<HTMLElement>();

const props = defineProps<{
    imageData : vtkImageData | undefined,
    brainAtlas: vtkImageData | undefined,
    atlasCorrection: TransformCorrection,
    maxValue: number,
}>()

let fullRenderWindow : vtkFullScreenRenderWindow;
let renderWindow: vtkRenderWindow;
let renderer: vtkRenderer;
let sliceRenderer: vtkRenderer;
let volumeActor: vtkVolume;
let volumeMapper: vtkVolumeMapper;
let imageActor: vtkImageSlice;
let imageMapper: vtkImageResliceMapper;
let imageSlicePlane: vtkPlane;

const ctfun = vtkColorTransferFunction.newInstance();

const atlasVisbility = ref<boolean>(true);
const imageVisbility = ref<boolean>(true);

watch(()=> props.brainAtlas, setupBrainAtlas)

// let initialPosRefAtlas = [0,0,0]

//watch(()=> props.atlasCorrection, changeTransformCorrection, {deep:true})

// function changeTransformCorrection(){
//   imageActor.setScale(props.atlasCorrection.scale[0],props.atlasCorrection.scale[1],props.atlasCorrection.scale[2])
//     imageActor.setOrientation(props.atlasCorrection.rotation[0],props.atlasCorrection.rotation[1],props.atlasCorrection.rotation[2])
//     imageActor.setPosition(initialPosRefAtlas[0]+props.atlasCorrection.position[0], 
//                                  initialPosRefAtlas[1]+props.atlasCorrection.position[1], 
//                                  initialPosRefAtlas[2]+props.atlasCorrection.position[2])
//   renderWindow.render()
// }

function setupBrainAtlas(){
  if (imageMapper && props.brainAtlas) {
    imageMapper.setInputData(props.brainAtlas);
    const imc = props.brainAtlas.getCenter();
    imageSlicePlane.setOrigin(imc);

    // initialPosRefAtlas = imageActor.getPosition()

    // imageActor.setScale(props.atlasCorrection.scale[0],props.atlasCorrection.scale[1],props.atlasCorrection.scale[2])
    // imageActor.setOrientation(props.atlasCorrection.rotation[0],props.atlasCorrection.rotation[1],props.atlasCorrection.rotation[2])
    // imageActor.setPosition(initialPosRefAtlas[0]+props.atlasCorrection.position[0], 
    //                              initialPosRefAtlas[1]+props.atlasCorrection.position[1], 
    //                              initialPosRefAtlas[2]+props.atlasCorrection.position[2])

    render()
  }
}

watch(()=> props.imageData, setupVolumeData)
watch(()=> props.maxValue, updateColorMap)

// Sample the shared d3 z-score scale into the vtk transfer function. The volume
// mapper looks up colors on the transfer function's own range, so it is built
// over the data range directly.
function updateColorMap(){
    applyInterpolator(ctfun, zScoreInterpolator, [-props.maxValue, props.maxValue])
    render()
}

function setupVolumeData(){
    if(props.imageData){
        volumeMapper.setInputData(props.imageData);
        renderer.resetCamera(props.imageData.getBounds())
        render();
    }
}

function setVisiblities(){
  if (volumeActor && volumeMapper) {
    volumeActor.setVisibility(imageVisbility.value);
    render();
  }
  if (imageActor && imageMapper) {
    imageActor.setVisibility(atlasVisbility.value);
    render();
  }
}

function render(){
    if (renderWindow && props.imageData && props.brainAtlas) {
        renderWindow.render();
    }
}

onMounted(()=>{
    fullRenderWindow = vtkFullScreenRenderWindow.newInstance({
        container: vtkContainer.value,
    });

    volumeActor = vtkVolume.newInstance();
    volumeMapper = vtkVolumeMapper.newInstance();        
    volumeActor.setMapper(volumeMapper);

    imageActor = vtkImageSlice.newInstance();
    imageMapper = vtkImageResliceMapper.newInstance();        
    imageActor.setMapper(imageMapper); 

    imageSlicePlane = vtkPlane.newInstance();
    imageSlicePlane.setNormal(0, 1, 0);
    imageMapper.setSlicePlane(imageSlicePlane);
    imageMapper.setSlabType(SlabTypes.MAX);

    renderer = fullRenderWindow.getRenderer();
    renderWindow = fullRenderWindow.getRenderWindow();

    sliceRenderer = vtkRenderer.newInstance({ background: [0, 0, 0] });
    renderWindow.addRenderer(sliceRenderer)

    sliceRenderer.setLayer(0);
    renderer.setLayer(1);

    renderWindow.setNumberOfLayers(2);

    sliceRenderer.setActiveCamera(renderer.getActiveCamera());

    renderWindow.getInteractor().onAnimation(alignSlice);

    renderer.setBackground(0,0,0)

    renderer.addVolume(volumeActor);
    sliceRenderer.addActor(imageActor);

    // create color and opacity transfer functions
    applyInterpolator(ctfun, zScoreInterpolator, [-props.maxValue, props.maxValue])

    const ofun = vtkPiecewiseFunction.newInstance();
    ofun.addPoint(-20, 1.0);
    ofun.addPoint(0, 0.0);
    ofun.addPoint(20, 1.0);

    volumeActor.getProperty().setRGBTransferFunction(0, ctfun);
    volumeActor.getProperty().setScalarOpacity(0, ofun);
    volumeActor.getProperty().setScalarOpacityUnitDistance(0, 4.5);
    volumeActor.getProperty().setInterpolationTypeToFastLinear();

    // Halve the grayscale brightness (vtk defaults to window 255 / level 127.5) so
    // the atlas slice recedes behind the volume, without the actor leaving the
    // opaque pass the way a reduced opacity would.
    imageActor.getProperty().setColorWindow(510);
    imageActor.getProperty().setColorLevel(255);

    setupBrainAtlas()
    setupVolumeData()
    alignSlice()
    renderWindow.render()
})

function alignSlice(){
    sliceRenderer.setActiveCamera(renderer.getActiveCamera());
    imageSlicePlane.setNormal(renderer.getActiveCamera().getDirectionOfProjection());
}

onBeforeUnmount(() => {
    ctfun.delete();
    volumeActor.delete();
    volumeMapper.delete();
    fullRenderWindow.delete();
});
</script>

<template>
    <div class="position-relative w-100 h-100">
        <div class="position-absolute w-100 d-flex justify-content-between align-items-center text-light p-2">
            <div class="w-333 text-start"></div>
            <div class="w-333 text-center">
                <h3 class="">Volume</h3>
            </div>
            <div class="w-333 d-flex flex-column justify-content-start align-items-end text-light">
                <div class="form-check-reverse form-switch">
                    <label class="form-check-label" for="atlasCheck">Atlas</label>
                    <input class="form-check-input" role="switch" id="atlasCheck" type="checkbox" v-model="atlasVisbility" @change="setVisiblities"/>
                </div>
                <div class="form-check-reverse form-switch">
                    <label class="form-check-label" for="zscoreCheck">Z-scores</label>
                    <input class="form-check-input" role="switch" id="zscoreCheck" type="checkbox" v-model="imageVisbility" @change="setVisiblities"/>
                </div>
            </div>
        </div>
        <div class="w-100 h-100" ref="vtkContainer"/>    
    </div>
</template>

<style scoped>

</style>
