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

        const isPortrait =
            viewportHeight > viewportWidth;

        if(isPortrait){

            /*
             * Na rotatie wordt de virtuele hoogte de zichtbare breedte
             * en de virtuele breedte de zichtbare hoogte.
             */
            const scale = Math.min(
                viewportWidth / this.baseHeight,
                viewportHeight / this.baseWidth
            );

            const rotatedWidth =
                this.baseHeight * scale;

            const rotatedHeight =
                this.baseWidth * scale;

            const offsetX =
                (viewportWidth - rotatedWidth) / 2;

            const offsetY =
                (viewportHeight - rotatedHeight) / 2;

            app.style.transformOrigin = "top left";

            app.style.transform = `
                translate(${offsetX + rotatedWidth}px, ${offsetY}px)
                rotate(90deg)
                scale(${scale})
            `;

        } else {

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

            app.style.transformOrigin = "top left";

            app.style.transform = `
                translate(${offsetX}px, ${offsetY}px)
                scale(${scale})
            `;
        }
    }
};