document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    var canvas = document.querySelector("#canvas");
    var ctx = canvas.getContext("2d");

    function draw() {
        ctx.clearRect(0, 0, 750, 750);

        // Draw shapes
        shapes.forEach(function (val, ndx, arr) {
            var points = val.points;

            ctx.beginPath();
            for (var i = 0; i < points.length - 1; i++) {
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[i + 1].x, points[i + 1].y);
            }

            ctx.lineTo(points[0].x, points[0].y);
            ctx.stroke();
            ctx.closePath();
        });

        lights.forEach(function (val, ndx, arr) {
            ctx.beginPath();
            ctx.arc(val.x, val.y, 20, 0, 2 * Math.PI);
            ctx.fillStyle = val.color;
            ctx.fill();
            ctx.closePath();
        });

        rays.forEach(function (val, ndx, arr) {
            ctx.beginPath();
            ctx.moveTo(val.start.x, val.start.y);
            ctx.lineTo(val.end.x, val.end.y);
            ctx.stroke();
            ctx.closePath();
        });

        debugIntersect.forEach(function (point) {
            if (point != null) {
                ctx.beginPath();
                ctx.fillStyle = 'green';
                ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }
        });

        //otherDebugIntersect.forEach(function (point) {
        //    if (point != null) {
        //        ctx.beginPath();
        //        ctx.fillStyle = 'blue';
        //        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        //        ctx.fill();
        //        ctx.closePath();
        //    }
        //});

        debugLowest.forEach(function (point) {
            if (point != null) {
                ctx.beginPath();
                ctx.fillStyle = 'blue';
                ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }
        });

        window.webkitRequestAnimationFrame(draw);
    }

    window.webkitRequestAnimationFrame(draw);

});