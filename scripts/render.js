document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var canvas = document.querySelector("#canvas");
    var ctx = canvas.getContext("2d");

    function draw() {
        ctx.clearRect(0, 0, 750, 750);

        // Draw shapes
        ctx.fillStyle = 'teal';
        shapes.forEach(function (val, ndx, arr) {
            if (ndx != 0) {
                var points = val.points;

                ctx.beginPath();
                /* for (var i = 0; i < points.length - 1; i++) {
                 ctx.moveTo(points[i].x, points[i].y);
                 ctx.lineTo(points[i + 1].x, points[i + 1].y);
                 }*/

                //ctx.moveTo(points[0].x, points[0].y);
                for (var i = 0; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                //ctx.lineTo(points[0].x, points[0].y);

                ctx.fill();
                ctx.closePath();
            }

        });

        ctx.fillStyle = 'black';


        // Red lines
        /*ctx.strokeStyle = 'red';
         ctx.beginPath();
         for (var i = 0 ; i < light.visible.length - 1; i++) {
         ctx.moveTo(light.visible[i].x,            light.visible[i].y);
         ctx.lineTo(light.visible[i + 1].x,        light.visible[i + 1].y);
         ctx.stroke();
         }
         ctx.closePath();*/
        lights.forEach(function (light) {

            // Draw the triangles
            // TODO: cleanup
            ctx.fillStyle = light.color;
            for (var i = 0; i < light.visible.length - 1; i++) {
                ctx.beginPath();
                ctx.moveTo(light.x, light.y);
                ctx.lineTo(light.visible[i].x, light.visible[i].y);
                ctx.lineTo(light.visible[i + 1].x, light.visible[i + 1].y);
                ctx.fill();
                ctx.closePath();
            }
            ctx.beginPath();
            ctx.moveTo(light.x, light.y);
            ctx.lineTo(light.visible[light.visible.length - 1].x, light.visible[light.visible.length - 1].y);
            ctx.lineTo(light.visible[0].x, light.visible[0].y);
            ctx.fill();
            ctx.closePath();
        });

        ctx.fillStyle = 'yellow';
        lights.forEach(function (light) {
            // Draw light source
            ctx.beginPath();
            ctx.arc(light.x, light.y, 20, 0, 2 * Math.PI);
            ctx.fillStyle = light.color;
            ctx.fill();
            ctx.closePath();

            /*// All ray intersects
             ctx.fillStyle = 'green';
             light.allIntersects.forEach(function (point) {
             if (point != null) {
             ctx.beginPath();
             ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
             ctx.fill();
             ctx.closePath();
             }
             });

             // Only visible intersects
             ctx.fillStyle = 'blue';
             light.visible.forEach(function (point) {
             if (point != null) {
             ctx.beginPath();
             ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
             ctx.fill();
             ctx.closePath();
             }
             });*/
        });
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);

});