import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Quantum Core 3D Simulation
 * A premium interactive live wallpaper concept.
 */

class SingularityApp {
    constructor() {
        this.container = document.body;
        this.canvas = document.getElementById('canvas3d');

        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;

        this.initScene();
        this.initCore();
        this.initParticles();
        this.addEventListeners();
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x05070a);
        this.scene.fog = new THREE.FogExp2(0x05070a, 0.002);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        const mainLight = new THREE.PointLight(0x58a6ff, 2, 20);
        mainLight.position.set(2, 3, 4);
        this.scene.add(mainLight);

        const rimLight = new THREE.PointLight(0xff58a6, 1, 15);
        rimLight.position.set(-2, -1, 3);
        this.scene.add(rimLight);
    }

    initCore() {
        // Procedural Morpher Core
        const geometry = new THREE.IcosahedronGeometry(1.5, 32);

        // Custom Shader Material for Iridescent/Bioluminescent effect
        this.coreMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x58a6ff,
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.5,
            thickness: 2,
            ior: 1.5,
            iridescence: 1,
            iridescenceIOR: 1.3,
            sheen: 1,
            sheenColor: 0xffffff,
            emissive: 0x112244,
            emissiveIntensity: 0.5
        });

        this.core = new THREE.Mesh(geometry, this.coreMaterial);
        this.scene.add(this.core);

        // Core Glow Orb
        const glowGeo = new THREE.SphereGeometry(1.4, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x58a6ff,
            transparent: true,
            opacity: 0.15
        });
        this.glow = new THREE.Mesh(glowGeo, glowMat);
        this.scene.add(this.glow);

        // Original geometry reference for deformation
        this.originalVertices = geometry.attributes.position.array.slice();
    }

    initParticles() {
        const count = 3000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            sizes[i] = Math.random() * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            color: 0x58a6ff,
            size: 0.015,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => {
            this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
        });

        window.addEventListener('mousedown', () => {
            this.triggerPulse();
        });
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    triggerPulse() {
        const statusEl = document.getElementById('core-status');
        statusEl.innerText = 'OVERCLOCK';
        statusEl.style.color = '#ff58a6';

        setTimeout(() => {
            statusEl.innerText = 'STABLE';
            statusEl.style.color = '#58a6ff';
        }, 1000);
    }

    animate(time) {
        requestAnimationFrame((t) => this.animate(t));

        const elapsed = time * 0.001 || 0;

        // Smooth Mouse Parallax
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        this.camera.position.x = this.mouseX * 0.5;
        this.camera.position.y = this.mouseY * 0.5;
        this.camera.lookAt(0, 0, 0);

        // Core Morph Animation
        const positionAttribute = this.core.geometry.attributes.position;
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = this.originalVertices[i * 3];
            const y = this.originalVertices[i * 3 + 1];
            const z = this.originalVertices[i * 3 + 2];

            const noise = Math.sin(x * 2 + elapsed) * Math.cos(y * 2 + elapsed) * Math.sin(z * 2 + elapsed) * 0.15;

            positionAttribute.setXYZ(i, x * (1 + noise), y * (1 + noise), z * (1 + noise));
        }
        positionAttribute.needsUpdate = true;

        this.core.rotation.y += 0.002;
        this.core.rotation.z += 0.001;

        // Pulse logic based on interactive overclock
        const pulse = Math.sin(elapsed * 2) * 0.05 + 1;
        this.glow.scale.set(pulse, pulse, pulse);
        this.glow.material.opacity = 0.15 + Math.sin(elapsed * 4) * 0.05;

        // Rotate particles
        this.particles.rotation.y = elapsed * 0.05;
        this.particles.rotation.x = elapsed * 0.02;

        this.renderer.render(this.scene, this.camera);
    }
}

new SingularityApp();