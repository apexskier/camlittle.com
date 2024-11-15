---
title: "GLGE Tutorial 2"
slug: "glge-tut2"
date: 2011-12-14 00:00:00 -0700
tags: ["tech", "web", "tutorial"]
---

content:
[elements needed](#elements-needed) | [meshes](#meshes) | [animation](#animation) | [the rest](#the-rest-including-groups) | [javascript](#javascript) | [demo/download](#here-it-is---update-glge-isnt-supported-any-more)

## 3D objects with movement

If you haven't already, go and read the [first tutorial](/posts/glge-tut1/) in
this series. This tutorial will expand on the XML file from the first tutorial.
The javascript and html are exactly the same.

The XML file is the only one that will change. This example will include a
rotating cube and a sphere circling around it.

### Elements needed

If you'll remember, there are several things needed in our XML file. For this
one we will need...

- Two `<mesh>`s composed of...
    - `<positions>`,
    - `<normals>`,
    - `<uv1>` and
    - `<faces>`,
- Two `<material>`s,
- A `<camera>` and
- A `<scene>` composed of...
    - Two `<object>`s
    - Two `<light>`s.

### Meshes

We need to define two meshes for two separate objects in the scene: a cube and
a sphere. I'll go into a little more detail on making them in this tutorial
compared to the last one.

#### Cube

```xml
<mesh id="cube">
</mesh>
```

The cube is composed of six sides. Each side is made of two flat triangles
(like the one from the last tutorial). This will make a total of 36 corners or
36 coordinates in the `<positions>` element of the `<mesh>`, 36 coordinates in
the `<normals>` element of the `<mesh>` and 36 numbers in the `<faces>` element
of the `<mesh>`.

I'll start off with the `<positions>` element. Each of the 36 corners will need
an x, y, z coordinate. Each face of the cube will have be made of two triangles
composed of 6 coordinates.

For the top face, a flat square, we will need...

```xml
  1, 1, 1,   // right 1 unit, forward 1 unit, up 1 unit
 -1, 1, 1,   // left  1 unit, forward 1 unit, up 1 unit
  1,-1, 1,   // right 1 unit, back    1 unit, up 1 unit
 -1, 1, 1,   // left  1 unit, forward 1 unit, up 1 unit
 -1,-1, 1,   // left  1 unit, back    1 unit, up 1 unit
  1,-1, 1... // right 1 unit, back    1 unit, up 1 unit
```

Now we have the `<normals>` for the top face. Each line is an x, y, z
coordinate and defines which direction the light is reflected towards. A good
rule of thumb (at least for cubes and flat faces) is that the normal for each
corner of one face is +1 at the axis that all corners on the face are equal at.
For the top face, each corner of the face is +1 at the z axis, so each normal
is 0, 0, 1. The light is reflected up (to the z axis) for each corner and the
space in between corners.

```xml
0, 0, 1,
0, 0, 1,
0, 0, 1,
0, 0, 1,
0, 0, 1,
0, 0, 1...
```

Since our example will not have images associated with objects and because all
of the corners are defined separately, we don't need a `<uv1>` section or a
`<faces>` section. See another tutorial to learn about defining multiple
corners with the same position element.

Lets build the rest of the `<positions>` and `<normals>` elements.

```xml
<positions>
    /* back */
     1,  1, 1,
     1,  1, -1,
    -1,  1, -1,
     1,  1, 1,
    -1,  1, -1,
    -1,  1, 1,

    /* left */
    -1, -1, -1,
    -1, -1, 1,
    -1,  1, 1,
    -1, -1, -1,
    -1,  1, 1,
    -1,  1, -1,

    /* front */
     1, -1, -1,
     1, -1, 1,
    -1, -1, -1,
     1, -1, 1,
    -1, -1, 1,
    -1, -1, -1,

    /* right */
     1,  1, -1,
     1,  1, 1,
     1, -1, -1,
     1,  1, 1,
     1, -1, 1,
     1, -1, -1,

    /* top */
     1,  1, 1,
    -1,  1, 1,
     1, -1, 1,
    -1,  1, 1,
    -1, -1, 1,
     1, -1, 1,

    /* bottom */
     1,  1, -1,
     1, -1, -1,
    -1, -1, -1,
     1,  1, -1,
    -1, -1, -1,
    -1,  1, -1
</positions>
<normals>
    /* back */
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    /* left */
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,

    /* front */
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,

    /* right */
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    /* top */
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    /* bottom */
    0, 0,-1,
    0, 0,-1,
    0, 0,-1,
    0, 0,-1,
    0, 0,-1,
    0, 0,-1
</normals>
```

*don't include comments in your XML file, they're just here to help clear things up.

There's the mesh for the cube!

Now we can define the material for the cube. This is pretty easy and no
different than the last tutorial, an `id`, the `specular` value, and a `color`
(this time, blue).

```xml
<material id="cubeMat" specular="1" color="#0088bb" />
```

#### Sphere

Now we will make the sphere. GLGE doesn't have a very good way of dealing with
spheres, so it has to be defined in the same way as the cube. The sphere in
this example uses 1260 corners. I won't walk you through that, because I
haven't made one manually myself, I've just copied the code from other
examples. You can <a href="{{< resourceUrl "demo_xml.xml" >}}"
target="_blank">click here</a> to see the code I'm using if you really want to.

For the sphere material, I'm going to make it red, and a bit less shiny.

```xml
<material id="sphereMat" specular="0.5" color="#cc0000" />
```

### Animation

There are two ways to animate objects in GLGE. Animation can be defined in the javascript or the XML file. Usually animations are defined in the XML file and manipulated in the javascript file. For example, there could be an animation for a character walking and an animation for a character jumping (both in the XML file) and they could be switched via javascript. In this example, I'm only using the XML file.

#### Cube spin

I want the cube to rotate on the y and z axises.

First, I define this animation in an `<animation_vector>`. An `<animation_vector>` contains and id and the number of frames. These frames contribute to the speed of the animation (more on this later) and determine how we set keyframes.

```xml
<animation_vector id="spin" frames="240">

</animation_vector>
```

Inside the `<animation_vector>` we can set the attribute changes that will occur. To do this we add an `<animation_curve>` for each changing attribute.

So, we first add an `<animation_curve>` that changes the rotation around the y axis.

```xml
<animation_curve channel="RotY">

</animation_curve>
```

Inside this, we add the keyframes by adding `<linear_point>`s. Each has a `x` value that sets what frame it happens on, and a `y` value that sets the attribute value on that frame. So, in this example, at 0 frames in the animation (remember, the animation lasts 240 frames) the rotation on the y value is 0 radians, then it increases to 6.282 radians (about 360 degrees) on the 240th frame.

```xml
<linear_point x="0" y="0" />
<linear_point x="240" y="6.282" />
```

I also want it to rotate around the z axis, so we'll add another `<animation_curve>` inside the `<animation_vector>`. It's almost exaclty the same, only the `<animation_curve>`'s channel is set to the z axis.

```xml
<animation_curve channel="RotZ">
    <linear_point x="0" y="0" />
    <linear_point x="240" y="6.282" />
</animation_curve>
```

So here's the final code for the sphere's animation.

```xml
<animation_vector id="spin" frames="240">
    <animation_curve channel="RotY">
        <linear_point x="0" y="0" />
        <linear_point x="240" y="6.282" />
    </animation_curve>
    <animation_curve channel="RotZ">
        <linear_point x="0" y="0" />
        <linear_point x="240" y="6.282" />
    </animation_curve>
</animation_vector>
```

#### Sphere circling

I want the sphere to circle around the cube (or circling around the z axis. I could set an x and y location attribute for each frame, but there's a much more efficient way to do this.

What we really want to do is move the sphere out 3 units, then rotate the whole system it's on. Imagine holding a broom by the handle and swinging it around in a circle. The sphere is the broom's end, and it is rotating around you, the z axis.

To do this, we need to introduce a new element into the XML file, a `<group>`. Then we can apply the animation to the group. I'll go over the animation quickly, since it is very simple, then move onto the `<object>`s and `<group>`s. The only difference in this animation is that it has a total of 480 frames, rather than 240. This will make it take two times longer than the cube's animation.

```xml
<animation_vector id="circle" frames="480">
    <animation_curve channel="RotZ">
        <linear_point x="0" y="0" />
        <linear_point x="480" y="6.282" />
    </animation_curve>
</animation_vector>
```

### The rest (including groups)

Next we need to add a camera (see the <a href="/posts/glge-tut1/">previous tutorial</a> for more info).

```xml
<camera id="mainCamera" />
```

and make a scene, with a light in it (again, see the <a href="/posts/glge-tut1/">previous tutorial</a> for more info).

```xml
<scene id="mainScene" camera="#mainCamera" ambient_color="#fff">
    <light id="mainlight" loc_x="10" loc_y="15" loc_z="10" rot_x="-1.3" color="#fff" type="L_POINT" />
</scene>
```

Now we'll add the cube. It has an `id`, references the mesh set up earlier, the material set up earlier, has some location and rotation attributes, and some new attributes. The first new attribute is the frame rate. This sets how many frames per second is applied to the animation. So, a frame rate of 60 means that an animation with a length of 240 will take (240 / 60 = 4) 4 seconds to complete and an animation with a length 480 will take 8 seconds to complete.

```xml
<object id="cube" mesh="#cube" material="#cubeMat" frame_rate="60" animation="#spin" loc_z="-10" rot_y="1" rot_x="1" />
```

#### Groups

Well, one group.

I want to do two things separately to the sphere, so I need to surround it with a group (sort of like adding a container element for extra css).

The group is moved down 10 units (same level as the cube) with a location attribute, and has the `#circle` animation applied to it. Inside the group is the sphere object moved out 3. It also has, the mesh defined above, material defined above, and scale attributes that make it 80% of the original size.

```xml
<group id="sphereGroup" animation="#circle" frame_rate="60" loc_z="-10">
    <object id="sphere" mesh="#sphere" material="#sphereMat" loc_x="3" scale_x="0.8" scale_y="0.8" scale_z="0.8" />
</group>
```

Woohoo! We're done with the XML file for this tutorial. Here's the whole thing.

```xml
<?xml version="1.0"?>
<glge>

    <mesh id="cube">
        /* cube mesh code */
    </mesh>

    <mesh id="sphere">
        /* sphere mesh code */
    </mesh>

    <material id="cubeMat" specular="1" color="#0088bb" />
    <material id="sphereMat" specular="0.5" color="#cc0000" />

    <animation_vector id="spin" frames="240">
        <animation_curve channel="RotY">
            <linear_point x="0" y="0" />
            <linear_point x="240" y="6.282" />
        </animation_curve>
        <animation_curve channel="RotZ">
            <linear_point x="0" y="0" />
            <linear_point x="240" y="6.282" />
        </animation_curve>
    </animation_vector>

    <animation_vector id="circle" frames="480">
        <animation_curve channel="RotZ">
            <linear_point x="0" y="0" />
            <linear_point x="480" y="6.282" />
        </animation_curve>
    </animation_vector>

    <camera id="mainCamera" />

    <scene id="mainScene" camera="#mainCamera" ambient_color="#fff">
        <group id="sphereGroup" animation="#circle" frame_rate="60" loc_z="-10">
            <object id="sphere" mesh="#sphere" material="#sphereMat" loc_x="3" scale_x="0.8" scale_y="0.8" scale_z="0.8" />
        </group>
        <object id="cube" mesh="#cube" material="#cubeMat" frame_rate="60" animation="#spin" loc_z="-10" rot_y="1" rot_x="1" />
        <light id="mainlight" loc_x="10" loc_y="15" loc_z="10" rot_x="-1.3" color="#fff" type="L_POINT" />
    </scene>

</glge>
```

### Javascript

Last thing to do to make the animation work is to modify our javascript file a bit. If you use the javascript from the previous tutorial, it will render one frame of the animation and no more than that. Let's look at the javascript for a static scene first.

```js
var canvasElement = document.getElementById("canvas");
var doc = new GLGE.Document();

doc.load("tutorial2.xml");

doc.onLoad = function() {
    var renderer = new GLGE.Renderer(canvasElement);
    var scene = new GLGE.Scene();
    scene = doc.getElement("mainScene");
    renderer.setScene(scene);
    renderer.render();
}
```

The line we need to look at is here.

```js
renderer.render();
```

This renders the scene once.

We need to set it to render over and over again with a `setInterval()` function. GLGE has logic that slows the animation down, so you can set it to render every 1 millisecond.

```js
setInterval(function(){
    renderer.render();
}, 1);
```

Here is the complete javascript code.

```js
var canvasElement = document.getElementById("canvas");
var doc = new GLGE.Document();

doc.load("tutorial2.xml");

doc.onLoad = function() {
    var renderer = new GLGE.Renderer(canvasElement);
    var scene = new GLGE.Scene();
    scene = doc.getElement("mainScene");
    renderer.setScene(scene);

    setInterval(function(){
        renderer.render();
    }, 1);
}
```

### ~~Here it is~~---update, glge isn't supported any more

<canvas id="flatTriangle" width="400" height="300"></canvas>

<!--
<script src="http://example.com/glge-compiled-min.js"></script>

<script type="text/javascript">
var canvasElement = document.getElementById('flatTriangle');
var doc = new GLGE.Document();

doc.load("{{< resourceUrl "demo_xml.xml" >}}");

doc.onLoad = function() {
	var renderer = new GLGE.Renderer(canvasElement);
	var scene = new GLGE.Scene();
	scene = doc.getElement("mainScene");
	renderer.setScene(scene);

	setInterval(function(){
		renderer.render();
	}, 1);
}
</script>
-->
