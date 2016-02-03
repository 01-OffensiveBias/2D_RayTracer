var shapes, lights, rays;

(function () {
    "use strict";

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        setIntersectsOutside(intersects) {
            this.intersectsOutside = intersects;
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

        setVisibleArea(all, visible) {
            this.all = all;
            this.visible = visible;
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

            if (dir)
                this.dir = dir;
            if (length)
                this.length = this.start.distanceTo(this.end);
        }
    }

    class Ray extends Segment {
        constructor(p1, dir, dest) {
            //super(dir, 2147483647);
            //dir %= 2 * Math.PI;
            super(p1, new Point(p1.x + Math.cos(dir) * 2147483647, p1.y + Math.sin(dir) * 2147483647), dir);
            this.dest = new Point(dest.x, dest.y);
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

    // Thanks StackOverflow!
    function calculateLineIntersect(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
        var s1_x, s1_y, s2_x, s2_y;
        s1_x = p1_x - p0_x;
        s1_y = p1_y - p0_y;
        s2_x = p3_x - p2_x;
        s2_y = p3_y - p2_y;

        var s, t;
        s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            var i_x = p0_x + (t * s1_x);
            var i_y = p0_y + (t * s1_y);
            return new Point(i_x, i_y);
        }

        return null;
    }

    lights = [
        //new LightSource(650, 500, "yellow"),
       /** new LightSource(500, 300, "rgba(244, 67, 54, 0.5)"),
        new LightSource(515, 300, "rgba(255,255,255,0.2)"),
        new LightSource(485, 300, "rgba(255,255,255,0.2)"),
        new LightSource(500, 315, "rgba(255,255,255,0.2)"),
        new LightSource(500, 285, "rgba(255,255,255,0.2)"),
        new LightSource(515, 315, "rgba(255,255,255,0.2)"),
        new LightSource(515, 285, "rgba(255,255,255,0.2)"),
        new LightSource(485, 315, "rgba(255,255,255,0.2)"),*/
        new LightSource(485, 285, "rgba(255,255,255,0.2)")
    ];

    shapes = [
        new Rectangle(0, 0, 750, 750),
        new Rectangle(30, 30, 80, 80),
        new Rectangle(400, 80, 60, 120),
        new Rectangle(300, 550, 350, 50),
    ];

    document.querySelector('#canvas').onmousemove = function (e) {
        update(e);
    };
    update(null);
    function update(e) {
        if (e != null) {
            lights[0].x = e.clientX;
            lights[0].y = e.clientY;
        }

        lights.forEach(function (light) {
            rays = [];

            shapes.forEach(function (shape) {
                shape.points.forEach(function (point) {
                    rays.push(new Ray(new Point(light.x, light.y), Math.atan2(light.y - point.y, light.x - point.x) + Math.PI - .01, point));
                    rays.push(new Ray(new Point(light.x, light.y), Math.atan2(light.y - point.y, light.x - point.x) + Math.PI,       point));
                    rays.push(new Ray(new Point(light.x, light.y), Math.atan2(light.y - point.y, light.x - point.x) + Math.PI + .01, point));
                });
            });

            rays.sort(function (a, b) {
                return -a.dir + b.dir;
            });

            var allIntersects = []; // TODO: remove, used for debug rendering only
            var intersects = [];

            rays.forEach(function (ray, rayIndex) {

                var lowest = null;
                shapes.forEach(function (shape, shapeIndex) {
                    shape.segments.forEach(function (segment) {
                        var intersect = getLineIntersect(ray, segment);

                        if (intersect != null && (/*shapeIndex == 0 ||*/
                            intersect.distanceTo(segment.start) > 0.5 &&
                            intersect.distanceTo(segment.end) > 0.5)) {

                            //intersect.setIntersectsOutside(shapeIndex == 0);

                            if (lowest == null) {
                                lowest = intersect;
                            } else if (intersect.distanceTo(light) < lowest.distanceTo(light)) {
                                lowest = intersect;
                            }

                            allIntersects.push(intersect);
                        }
                    });
                });

                //TODO: fix
                if (lowest != null) {
                    // Works most of the time
                   if ((rayIndex - 1) % 3 == 0 && lowest.distanceTo(light) > ray.dest.distanceTo(light)) {
                        intersects.push(ray.dest)
                    } else {
                        intersects.push(lowest);
                    }
                } else {
                    if (shapes[0].segments.indexOf(ray.dest)) {
                        intersects.push(ray.dest);
                    }
                }
            });

            light.setVisibleArea(allIntersects, intersects);
        });
    }

})();


