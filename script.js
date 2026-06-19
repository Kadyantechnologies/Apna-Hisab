// ==========================================
// Three.js 3D Background Setup
// ==========================================
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Transparent background to show CSS background
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x4ade80, 2); // Greenish
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x3b82f6, 2); // Blueish
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

// Create 3D Objects (Abstract Coins / Nodes)
const objects = [];
const objectCount = 60;

// Geometries & Materials
const coinGeometry = new THREE.CylinderGeometry(2, 2, 0.4, 32);
const nodeGeometry = new THREE.IcosahedronGeometry(1.5, 0);

const materials = [
    new THREE.MeshStandardMaterial({ 
        color: 0x4ade80, 
        metalness: 0.8, 
        roughness: 0.2,
        transparent: true,
        opacity: 0.6
    }),
    new THREE.MeshStandardMaterial({ 
        color: 0x3b82f6, 
        metalness: 0.8, 
        roughness: 0.2,
        transparent: true,
        opacity: 0.6
    }),
    new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        metalness: 0.9, 
        roughness: 0.1,
        transparent: true,
        opacity: 0.3
    })
];

for (let i = 0; i < objectCount; i++) {
    // Randomly choose geometry and material
    const isCoin = Math.random() > 0.5;
    const geometry = isCoin ? coinGeometry : nodeGeometry;
    const material = materials[Math.floor(Math.random() * materials.length)];
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random positioning
    mesh.position.x = (Math.random() - 0.5) * 100;
    mesh.position.y = (Math.random() - 0.5) * 100;
    mesh.position.z = (Math.random() - 0.5) * 40 - 10;
    
    // Random rotation
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    // Add custom properties for animation
    mesh.userData = {
        rotationSpeedX: (Math.random() - 0.5) * 0.02,
        rotationSpeedY: (Math.random() - 0.5) * 0.02,
        floatSpeed: (Math.random() - 0.5) * 0.05,
        originalY: mesh.position.y
    };
    
    scene.add(mesh);
    objects.push(mesh);
}

// Mouse interaction tracking
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
});

// Scroll interaction
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Smooth mouse follow for camera
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (-targetY - camera.position.y) * 0.02;
    
    // Camera scroll effect (parallax)
    camera.position.y = -scrollY * 0.01;
    
    // Rotate and float objects
    objects.forEach((obj, i) => {
        obj.rotation.x += obj.userData.rotationSpeedX;
        obj.rotation.y += obj.userData.rotationSpeedY;
        
        // Floating effect using sine wave
        obj.position.y = obj.userData.originalY + Math.sin(elapsedTime * 2 + i) * 2;
    });

    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// ==========================================
// GSAP Scroll Animations
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Reveal animations for all elements with .gs-reveal class
const revealElements = document.querySelectorAll('.gs-reveal');

revealElements.forEach((elem) => {
    // Check if element has a delay class
    let delay = 0;
    if (elem.classList.contains('delay-1')) delay = 0.2;
    if (elem.classList.contains('delay-2')) delay = 0.4;
    if (elem.classList.contains('delay-3')) delay = 0.6;

    gsap.fromTo(elem, 
        { 
            y: 50, 
            opacity: 0 
        }, 
        {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: delay,
            ease: "power3.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%", // Trigger when top of element hits 85% of viewport height
                toggleActions: "play none none reverse" // Play on scroll down, reverse on scroll up
            }
        }
    );
});

// Floating animation for the mockups
gsap.to('.glass-phone-mockup', {
    y: -20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});
