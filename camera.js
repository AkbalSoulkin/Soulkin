const Camera = {

    baseWidth: 1920,
    baseHeight: 1080,

    update(){

        const app = document.getElementById("app");

        if(!app){
            console.error("Camera: #app kon niet worden gevonden.");
            return;
        }

        const viewportWidth =
            document.documentElement.clientWidth;

        const viewportHeight =
            document.documentElement.clientHeight;

        const scale = Math.min(
            viewportWidth / this.baseWidth,
            viewportHeight / this.baseHeight
        );

        const scaledWidth =
            this.baseWidth * scale;

        const scaledHeight =
            this.baseHeight * scale;

        const offsetX =
            (viewportWidth - scaledWidth) / 2;

        const offsetY =
            (viewportHeight - scaledHeight) / 2;

        app.style.transform =
            `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

    }

};