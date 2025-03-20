<template>

    <canvas ref="drawingArea" class="drawing-canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"
        @mouseleave="leaveDrawing" @mouseenter="enterDrawing"></canvas>

</template>

<script>
import { ref, onMounted } from 'vue';
export default {
    setup() {
        const drawingArea = ref(null);
        const isDrawing = ref(false);
        let context = null;
        onMounted(() => {
            const canvas = drawingArea.value;
            function reportWindowSize() {
                setTimeout(() => {
                    canvas.height = canvas.clientHeight;
                    canvas.width = canvas.clientWidth;
                })
            }
            reportWindowSize()
            addEventListener("resize", reportWindowSize);
            context = canvas.getContext('2d');
            context.lineWidth = 1;
            context.lineCap = "round";
            context.strokeStyle = "#000";
        });

        const startDrawing = (event) => {
            isDrawing.value = true;
            context.beginPath();
            context.moveTo(event.offsetX, event.offsetY);
        };

        const draw = (event) => {
            if (!isDrawing.value) return;
            context.lineTo(event.offsetX, event.offsetY);
            context.stroke();
        };

        const stopDrawing = () => {
            isDrawing.value = false;
            context.closePath();
        };

        const leaveDrawing = (event) => {
            isDrawing.value = false;
            context.closePath();
        };

        const enterDrawing = (event) => {
            if (event.buttons) {
                isDrawing.value = true;
                context.beginPath();
                context.moveTo(event.offsetX, event.offsetY);
            }
        };

        const clear = (event) => {
            const canvas = drawingArea.value;
            context.clearRect(0, 0, canvas.width, canvas.height);
        };



        return {
            drawingArea,
            enterDrawing,
            leaveDrawing,
            startDrawing,
            draw,
            clear,
            stopDrawing,
        };
    },
};
</script>
<style scoped>
.drawing-canvas {
    border: 1px solid #000;
    cursor: url('https://icons.iconarchive.com/icons/iconsmind/outline/24/Pen-icon.png') 0 23, auto;
    display: block;
}
</style>