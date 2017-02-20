// Copyright © 2016 RTE Réseau de transport d’électricité
(function() {
  'use strict';

  module.exports.Point = Point;
  module.exports.Line = Line;
  module.exports.intersectionOfTwoLines = intersectionOfTwoLines;
  module.exports.intersectionLineAndCircle = intersectionLineAndCircle;
  module.exports.pointInSegment = pointInSegment;
  module.exports.intersectionLineRadius  = intersectionLineRadius ;
  module.exports.distance = distance;

  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  function Line(a, b) {
    this.a = a;
    this.b = b
  }
  Line.prototype.getY = function(x) {
    return this.a + this.b * x;
  }

  function intersectionOfTwoLines(l1, l2) {
    if (l1.b == l2.b) return []
    return [new Point(
      (l2.a - l1.a) / (l1.b - l2.b),
      (l1.b * l2.a - l1.a * l2.b) / (l1.b - l2.b)
    )]
  }

  function intersectionLineRadius(l, angle, radius) {
    var l2 = new Line(0, Math.tan(angle));
    var intersect = intersectionOfTwoLines(l, l2);
    var s1 = new Point(0, 0);
    var s2 = new Point(radius * Math.cos(angle), radius * Math.sin(angle));

    if (intersect.length == 0 || !pointInSegment(intersect[0], s1, s2)) {
      return [];
    } else {
      return intersect;
    }
  }

  function intersectionLineAndCircle(l, r) {
    var x = solveEqSecondDegree(l.b * l.b + 1, 2 * l.a * l.b, l.a * l.a - r * r);
    return x.map(function(x) {return new Point(x, l.getY(x))});
  }

  // Is point p inside the segment defined by s1 and s2. It is assumed that the
  // three points are aligned.
  function pointInSegment(p, s1, s2) {
    var kp = dotProd(pointDiff(s2, s1), pointDiff(p, s1));
    var ks = dotProd(pointDiff(s2, s1), pointDiff(s2, s1));
    return kp >= 0 && kp <= ks;
  }

  function pointDiff(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
  }

  function dotProd(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
  }

  function solveEqSecondDegree(a, b, c) {
    var det = b * b - 4 * a * c
    if (det < 0) return [];
    if (det == 0) return [(- b) / (2 * a)];
    else return [
      (-b - Math.sqrt(det)) / (2 * a),
      (-b + Math.sqrt(det)) / (2 * a)
    ]
  }

  function distance(p1, p2) {
    return Math.sqrt( Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }
}());
