var shapes, lights, rays, debugIntersect = [], debugLowest = [], otherDebugIntersect = [];

(function () {
    "use strict";

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        distanceTo(other) {
            return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
        }
    }

    class LightSource extends Point {
        constructor(x, y, color) {
            super(x, y);
            this.color = color;
        }
    }

    class Vector {
        constructor(dir, mag) {
            this.dir = dir;
            this.mag = mag;
        }

        add(other) {
            let dir = Math.atan(
                ((Math.sin(this.dir) + Math.sin(other.dir)) / 2) /
                ((Math.cos(this.dir) + Math.cos(other.dir)) / 2)
            );
            let mag = (this.mag + other.mag) / 2;

            return new Vector(dir, mag);
        }
    }

    class Segment {
        constructor(p1, p2, dir, length) {
            this.start = p1;
            this.end = p2;

            if (!dir)
                this.dir = Math.atan(p2.x - p1.x / p2.y - p1.y);
            if (!length)
                this.length = this.start.distanceTo(this.end);
        }
    }

    class Ray extends Segment {
        constructor(p1, dir, dest) {
            //super(dir, 2147483647);
            super(p1, new Point(p1.x + Math.cos(dir) * 2147483647, p1.y + Math.sin(dir) * 2147483647), dir);
            this.dest = dest;
            // val.start.x + Math.cos(dir) * 2147483647, val.start.y + Math.sin(dir) * 2147483647
        }
    }

    class Rectangle {
        constructor(x, y, width, height, color) {
            this.pos = new Point(x, y);
            this.width = width;
            this.height = height;
            this.color = color ? color : '#000';
        }

        get points() {
            return [
                new Point(this.pos.x, this.pos.y),
                new Point(this.pos.x + this.width, this.pos.y),
                new Point(this.pos.x + this.width, this.pos.y + this.height),
                new Point(this.pos.x, this.pos.y + this.height)
            ];
        }

        get segments() {
            var segments = [];
            for (var i = 0; i < this.points.length - 1; i++) {
                segments.push(new Segment(this.points[i], this.points[i + 1]));
            }
            segments.push(new Segment(this.points[0], this.points[segments.length]));

            return segments;
        }

        get centerPoint() {
            return new Point(
                this.pos.x + (width / 2),
                this.pos.y + (height / 2)
            );
        }
    }

    function getLineIntersect(s1, s2) {
        return calculateLineIntersect(s1.start.x, s1.start.y, s1.end.x, s1.end.y, s2.start.x, s2.start.y, s2.end.x, s2.end.y);
    }

    // Returns a Point if the lines intersect, otherwise null. In addition, if the lines
    function calculateLineIntersect(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
        var s1_x, s1_y, s2_x, s2_y;
        s1_x = p1_x - p0_x;
        s1_y = p1_y - p0_y;
        s2_x = p3_x - p2_x;
        s2_y = p3_y - p2_y;

        var s, t;
        s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

        if (s >= 0 && s <= 1.05 && t >= 0 && t <= 1.05) {
            // Collision detected
            var i_x = p0_x + (t * s1_x);
            var i_y = p0_y + (t * s1_y);
            return new Point(i_x, i_y);
        }

        return null; // No collision
    }

    lights = [
        new LightSource(200, 250, "yellow")
    ];

    shapes = [
        new Rectangle(0, 0, 750, 750),
        new Rectangle(30, 30, 80, 80),
        new Rectangle(400, 80, 60, 120)
    ];

    rays = [];

    document.querySelector('#canvas').onmousemove = function (e) {
        rays = [];

        lights.forEach(function (light) {
            light.x = e.clientX;
            light.y = e.clientY;

            shapes.forEach(function (shape) {
                shape.points.forEach(function (point) {
                    rays.push(new Ray(new Point(light.x, light.y), Math.atan2(light.y - point.y, light.x - point.x) - Math.PI, point));
                });
            });
        });

        rays.sort(function (a, b) {
            return a.dir - b.dir;
        });

        //console.log(rays);

        debugIntersect = [];
        debugLowest = [];
        otherDebugIntersect = [];

        var light = lights[0];


        rays.forEach(function (ray) {
            var intersections = [];
            var lowest = null;
            /*shapes.forEach(function (shape) {
                intersections.concat(shape.points);
            });*/
            intersections.push(ray.dest);


            shapes.forEach(function (shape) {
                shape.segments.forEach(function (segment) {
                    var intersect = getLineIntersect(ray, segment);

                    if (intersect != null
                        /*intersect.distanceTo(segment.start) > 0.5 &&
                        intersect.distanceTo(segment.end) > 0.5*/) {

                        if (lowest == null) {
                            lowest = intersect;
                        } else if (intersect.distanceTo(light) < lowest.distanceTo(light)) {
                            lowest = intersect;
                        }

                        intersections.push(intersect);
                        debugIntersect.push(intersect);
                    }
                });



            });

            if (lowest != null) {
                debugLowest.push(lowest);
            }
            //debugLowest.push(ray.dest);
        });
    };

})();


/* var light = lights[0];
 shapes.forEach(function (shape) {
 shape.segments.forEach(function (segment) {

 var intersections = [];

 rays.forEach(function (ray) {
 var intersect = getLineIntersect(ray, segment);

 var lowest = null;

 if (intersect != 0 && intersect != null &&
 intersect.distanceTo(segment.start) > 0.5 &&
 intersect.distanceTo(segment.end) > 0.5) { // Null check should not be needed

 if (lowest == null) {
 lowest = intersect;
 } else if (intersect.distanceTo(light) < lowest.distanceTo(light)) {
 lowest = intersect;
 }
 }

 if (lowest != null) {
 debugLowest.push(lowest);
 intersections.push(intersect);
 debugIntersect.push(intersect);
 }
 });

 shapes.forEach(function (shape) {
 intersections.concat(shape.points);
 });
 });
 });
 };*/