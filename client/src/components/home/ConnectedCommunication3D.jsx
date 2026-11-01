import React, { useRef, useEffect } from 'react';

/**
 * ConnectedCommunication3D
 * 
 * An advanced animated 3D communication-inspired environment:
 * - Concept: Connected Languages — Voice — Communication
 * - Large interconnected 3D glass and chrome ribbon structures (multiple flowing loops crossing in 3D space)
 * - Floating translucent glass spheres with realistic refraction, depth, and specular highlights
 * - Animated sound-wave rings pulsing outward from the communication nexus
 * - Fine glowing communication constellation nodes connected by delicate filament lines
 * - Small voice-translation particles travelling along communication paths
 * - Realistic glass & chrome lighting: soft crimson, champagne gold, silver, pearl white, lavender
 * - Smooth desktop mouse parallax, IntersectionObserver pause, reduced-motion fallback,
 *   and non-blocking pointer events.
 */
export default function ConnectedCommunication3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = null;
    let isVisible = true;
    let width = 0;
    let height = 0;

    // Reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Calm, non-intrusive ambient background (Strictly NO mouse parallax or cursor tracking)
    let mouseX = 0;
    let mouseY = 0;

    // Handle high-DPI canvas resizing
    const resize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Pause rendering when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Geometry Generation Settings
    const NUM_SEGMENTS = 72;
    const NUM_SOUND_RINGS = 5;

    // 48 Voice Translation Pulses flowing along the 3 Ribbon Loops
    const particles = Array.from({ length: 48 }, (_, i) => ({
      t: i / 48,
      loop: i % 3,
      speed: 0.0015 + (i % 6) * 0.0003,
      size: 2.2 + (i % 4) * 1.1,
      opacity: 0.5 + (i % 5) * 0.12,
      offset: ((i * 7) % 21 - 10)
    }));

    let time = 0;

    // 3D vector rotation helpers
    const rotateX = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x, y * cos - z * sin, y * sin + z * cos];
    };

    const rotateY = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x * cos + z * sin, y, -x * sin + z * cos];
    };

    const rotateZ = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x * cos - y * sin, x * sin + y * cos, z];
    };

    // Parametric curves for 3 interconnected, crossing 3D loops:
    // Scale dynamically with viewport dimensions so ribbons are genuinely expansive
    const getCurvePoint = (u, loopIdx, tAnim) => {
      const isMobile = width < 768;
      const baseR = isMobile
        ? Math.max(width * 0.42, 150)
        : Math.min(width * 0.36, height * 0.48);
      const r = baseR * 0.54;
      const angle = u * Math.PI * 2;

      if (loopIdx === 0) {
        // Loop 0: Kannada Voice Loop (sweeping crimson ribbon to left & crossing center)
        const loopOffset = -baseR * 0.65;
        let x = Math.sin(angle) * baseR * 0.95 + loopOffset * Math.cos(tAnim * 0.22);
        let y = Math.sin(angle * 2) * (r * 0.92) + Math.cos(angle) * (r * 0.28);
        let z = Math.cos(angle) * (baseR * 0.65) + Math.sin(angle * 3 + tAnim) * 20;
        return [x, y, z];
      } else if (loopIdx === 1) {
        // Loop 1: English / Universal Voice Loop (interlocking champagne gold ribbon to right)
        const loopOffset = baseR * 0.65;
        let x = Math.sin(angle) * baseR * 0.95 + loopOffset * Math.cos(tAnim * 0.22);
        let y = Math.sin(angle * 2 + Math.PI) * (r * 0.92) - Math.cos(angle) * (r * 0.28);
        let z = Math.cos(angle + Math.PI * 0.5) * (baseR * 0.65) + Math.cos(angle * 3 + tAnim) * 20;
        return [x, y, z];
      } else {
        // Loop 2: Harmonizing Voice Bridge (wraps and weaves across both loops in center)
        const bridgeR = baseR * 1.05;
        let x = Math.cos(angle) * bridgeR * 1.15;
        let y = Math.sin(angle * 3 + tAnim * 0.65) * (r * 0.68);
        let z = Math.sin(angle) * (baseR * 0.78);
        return [x, y, z];
      }
    };

    // Render loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += prefersReducedMotion ? 0 : 0.016;

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.48 + Math.sin(time * 0.6) * 7;
      const focalLength = 720;
      const isMobile = width < 768;
      const ribbonWidth = isMobile ? 22 : 36;
      const baseR = isMobile
        ? Math.max(width * 0.42, 150)
        : Math.min(width * 0.36, height * 0.48);

      // Stable, comfortable ambient rotation (Independent of mouse position)
      const rotAngleY = time * 0.12;
      const rotAngleX = 0.2 + Math.sin(time * 0.25) * 0.04;
      const rotAngleZ = Math.cos(time * 0.18) * 0.03;

      // Perspective projection helper
      const project = ([px, py, pz]) => {
        const scale = focalLength / (focalLength + pz + 450);
        return [centerX + px * scale, centerY + py * scale, scale, pz];
      };

      const applySceneRotation = ([vx, vy, vz]) => {
        let [rx, ry, rz] = rotateY(vx, vy, vz, rotAngleY);
        [rx, ry, rz] = rotateX(rx, ry, rz, rotAngleX);
        [rx, ry, rz] = rotateZ(rx, ry, rz, rotAngleZ);
        return [rx, ry, rz];
      };

      // =======================================================================
      // LAYER 1: EXPANDING SOUND-WAVE RINGS
      // =======================================================================
      for (let rIdx = 0; rIdx < NUM_SOUND_RINGS; rIdx++) {
        const ringProgress = (time * 0.2 + rIdx / NUM_SOUND_RINGS) % 1;
        const currentRadius = 40 + ringProgress * (baseR * 2.3);
        const ringAlpha = Math.sin(ringProgress * Math.PI) * 0.32 * (1 - ringProgress * 0.3);

        if (ringAlpha > 0.01) {
          ctx.save();
          ctx.beginPath();
          const ringPoints = [];
          const RING_SEGS = 36;
          for (let s = 0; s <= RING_SEGS; s++) {
            const th = (s / RING_SEGS) * Math.PI * 2;
            const rx = Math.cos(th) * currentRadius;
            const rz = Math.sin(th) * (currentRadius * 0.62);
            const ry = Math.sin(th * 3 + time * 1.4) * 10;

            const rotated = applySceneRotation([rx, ry, rz]);
            const proj = project(rotated);
            ringPoints.push(proj);
          }

          ctx.moveTo(ringPoints[0][0], ringPoints[0][1]);
          for (let s = 1; s < ringPoints.length; s++) {
            ctx.lineTo(ringPoints[s][0], ringPoints[s][1]);
          }
          ctx.closePath();

          const ringGrad = ctx.createLinearGradient(
            centerX - currentRadius * 0.7,
            centerY,
            centerX + currentRadius * 0.7,
            centerY
          );
          ringGrad.addColorStop(0, `rgba(220, 38, 38, ${(ringAlpha * 0.85).toFixed(3)})`);
          ringGrad.addColorStop(0.5, `rgba(245, 158, 11, ${(ringAlpha * 0.95).toFixed(3)})`);
          ringGrad.addColorStop(1, `rgba(167, 139, 250, ${(ringAlpha * 0.8).toFixed(3)})`);

          ctx.strokeStyle = ringGrad;
          ctx.lineWidth = 1.35;
          ctx.stroke();
          ctx.restore();
        }
      }

      // =======================================================================
      // LAYER 2: GLOWING COMMUNICATION CONSTELLATION NODES & LINES
      // =======================================================================
      // Dynamic node distribution adapted to screen width
      const spanX = Math.max(width * 0.44, 280);
      const spanY = Math.max(height * 0.36, 180);
      const nodesData = [
        { x: -spanX * 0.85, y: -spanY * 0.5, z: -50, p: 0 },
        { x: -spanX * 0.55, y: -spanY * 0.8, z: 90, p: 1 },
        { x: -spanX * 0.35, y: -spanY * 0.3, z: -110, p: 2 },
        { x: -spanX * 0.7, y: spanY * 0.45, z: 70, p: 3 },
        { x: -spanX * 0.25, y: spanY * 0.75, z: -40, p: 4 },
        { x: 0, y: -spanY * 0.65, z: 130, p: 5 },
        { x: spanX * 0.3, y: -spanY * 0.85, z: -90, p: 6 },
        { x: spanX * 0.55, y: -spanY * 0.4, z: 110, p: 7 },
        { x: spanX * 0.85, y: -spanY * 0.6, z: -40, p: 8 },
        { x: spanX * 0.4, y: spanY * 0.45, z: -130, p: 9 },
        { x: spanX * 0.7, y: spanY * 0.7, z: 60, p: 10 },
        { x: spanX * 0.9, y: spanY * 0.3, z: -70, p: 11 },
        { x: 0, y: spanY * 0.85, z: 80, p: 12 }
      ];

      const projectedNodes = nodesData.map((node) => {
        const floatY = node.y + Math.sin(time * 1.2 + node.p) * 7;
        const rot = applySceneRotation([node.x, floatY, node.z]);
        const [sx, sy, scale, pz] = project(rot);
        return { sx, sy, scale, pz, rawX: rot[0], rawY: rot[1], rawZ: rot[2] };
      });

      ctx.save();
      const distLimit = isMobile ? 180 : 250;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          const dist3D = Math.hypot(n1.rawX - n2.rawX, n1.rawY - n2.rawY, n1.rawZ - n2.rawZ);

          if (dist3D < distLimit) {
            const lineAlpha = (1 - dist3D / distLimit) * 0.24 * Math.min(n1.scale, n2.scale);
            ctx.beginPath();
            ctx.moveTo(n1.sx, n1.sy);
            ctx.lineTo(n2.sx, n2.sy);
            ctx.strokeStyle = `rgba(217, 119, 6, ${lineAlpha.toFixed(3)})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      projectedNodes.forEach((node) => {
        const r = 2.6 * node.scale;
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${(0.7 * node.scale).toFixed(2)})`;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
        ctx.shadowBlur = 7 * node.scale;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.restore();

      // =======================================================================
      // LAYER 3: 3D DEPTH-SORTED OBJECTS (RIBBON POLYGONS & GLASS SPHERES)
      // =======================================================================
      const renderList = [];

      // A. Generate Ribbon Polygons for all 3 loops
      for (let loop = 0; loop < 3; loop++) {
        let loopType = 'crimson';
        if (loop === 1) loopType = 'gold';
        if (loop === 2) loopType = 'bridge';

        for (let i = 0; i < NUM_SEGMENTS; i++) {
          const u1 = i / NUM_SEGMENTS;
          const u2 = ((i + 1) % NUM_SEGMENTS) / NUM_SEGMENTS;

          const p1 = getCurvePoint(u1, loop, time);
          const p2 = getCurvePoint(u2, loop, time);

          const dx = p2[0] - p1[0];
          const dy = p2[1] - p1[1];
          const dz = p2[2] - p1[2];
          const len = Math.hypot(dx, dy, dz) || 1;

          const twistAngle = u1 * Math.PI * 2 + (loop === 0 ? 0 : loop === 1 ? Math.PI * 0.5 : Math.PI * 0.25);
          const nx = (-dy / len) * Math.cos(twistAngle);
          const ny = (dx / len) * Math.cos(twistAngle);
          const nz = Math.sin(twistAngle);

          const w = (loop === 2 ? ribbonWidth * 0.75 : ribbonWidth) * (0.85 + Math.sin(u1 * Math.PI * 4 + time) * 0.15);

          const v1 = [p1[0] + nx * w, p1[1] + ny * w, p1[2] + nz * w];
          const v2 = [p1[0] - nx * w, p1[1] - ny * w, p1[2] - nz * w];
          const v3 = [p2[0] - nx * w, p2[1] - ny * w, p2[2] - nz * w];
          const v4 = [p2[0] + nx * w, p2[1] + ny * w, p2[2] + nz * w];

          const r1 = applySceneRotation(v1);
          const r2 = applySceneRotation(v2);
          const r3 = applySceneRotation(v3);
          const r4 = applySceneRotation(v4);

          const avgZ = (r1[2] + r2[2] + r3[2] + r4[2]) * 0.25;

          const edge1 = [r2[0] - r1[0], r2[1] - r1[1], r2[2] - r1[2]];
          const edge2 = [r4[0] - r1[0], r4[1] - r1[1], r4[2] - r1[2]];
          const normX = edge1[1] * edge2[2] - edge1[2] * edge2[1];
          const normY = edge1[2] * edge2[0] - edge1[0] * edge2[2];
          const normZ = edge1[0] * edge2[1] - edge1[1] * edge2[0];
          const normLen = Math.hypot(normX, normY, normZ) || 1;
          const nzUnit = Math.abs(normZ / normLen);

          renderList.push({
            type: 'ribbon',
            z: avgZ,
            p1: project(r1),
            p2: project(r2),
            p3: project(r3),
            p4: project(r4),
            nz: nzUnit,
            loopType,
            u: u1
          });
        }
      }

      // B. Generate Floating Translucent Glass Spheres (Spread across canvas)
      const sphScale = isMobile ? 0.7 : 1;
      const sphereData = [
        { bx: -spanX * 0.72, by: -spanY * 0.45, bz: -60, r: 42 * sphScale, ph: 0.2, f: 0.8, a: 16, tint: 'crimson' },
        { bx: spanX * 0.74, by: -spanY * 0.38, bz: 50, r: 46 * sphScale, ph: 1.4, f: 0.7, a: 18, tint: 'gold' },
        { bx: -spanX * 0.6, by: spanY * 0.52, bz: 110, r: 36 * sphScale, ph: 2.7, f: 0.9, a: 14, tint: 'lavender' },
        { bx: spanX * 0.65, by: spanY * 0.48, bz: -90, r: 38 * sphScale, ph: 3.8, f: 0.75, a: 17, tint: 'silver' },
        { bx: 0, by: -spanY * 0.75, bz: -140, r: 30 * sphScale, ph: 4.5, f: 1.1, a: 12, tint: 'pearl' },
        { bx: -spanX * 0.92, by: spanY * 0.15, bz: 170, r: 26 * sphScale, ph: 5.1, f: 0.6, a: 15, tint: 'crimson' },
        { bx: spanX * 0.9, by: -spanY * 0.12, bz: -160, r: 32 * sphScale, ph: 0.9, f: 0.85, a: 14, tint: 'gold' },
        { bx: spanX * 0.22, by: spanY * 0.68, bz: 90, r: 24 * sphScale, ph: 2.1, f: 1.0, a: 12, tint: 'lavender' }
      ];

      sphereData.forEach((sph) => {
        const floatY = sph.by + Math.sin(time * sph.f + sph.ph) * sph.a;
        const rot = applySceneRotation([sph.bx, floatY, sph.bz]);
        const [sx, sy, scale, pz] = project(rot);

        renderList.push({
          type: 'sphere',
          z: rot[2],
          sx,
          sy,
          scale,
          r: sph.r * scale,
          tint: sph.tint
        });
      });

      // Sort all 3D items back-to-front (Painter's algorithm)
      renderList.sort((a, b) => b.z - a.z);

      // Render 3D items
      renderList.forEach((item) => {
        if (item.type === 'ribbon') {
          const poly = item;
          const specular = Math.pow(poly.nz, 3);
          const rim = Math.pow(1 - poly.nz, 2);

          ctx.beginPath();
          ctx.moveTo(poly.p1[0], poly.p1[1]);
          ctx.lineTo(poly.p2[0], poly.p2[1]);
          ctx.lineTo(poly.p3[0], poly.p3[1]);
          ctx.lineTo(poly.p4[0], poly.p4[1]);
          ctx.closePath();

          const grad = ctx.createLinearGradient(
            poly.p1[0],
            poly.p1[1],
            poly.p3[0],
            poly.p3[1]
          );

          if (poly.loopType === 'crimson') {
            const crimsonAlpha = (0.24 + rim * 0.42).toFixed(2);
            const silverAlpha = (0.7 + specular * 0.3).toFixed(2);
            grad.addColorStop(0, `rgba(255, 248, 248, ${silverAlpha})`);
            grad.addColorStop(0.48, `rgba(220, 38, 38, ${crimsonAlpha})`);
            grad.addColorStop(1, `rgba(240, 244, 252, ${(silverAlpha * 0.88).toFixed(2)})`);
          } else if (poly.loopType === 'gold') {
            const goldAlpha = (0.26 + rim * 0.4).toFixed(2);
            const silverAlpha = (0.7 + specular * 0.3).toFixed(2);
            grad.addColorStop(0, `rgba(255, 253, 245, ${silverAlpha})`);
            grad.addColorStop(0.48, `rgba(217, 119, 6, ${goldAlpha})`);
            grad.addColorStop(1, `rgba(238, 242, 255, ${(silverAlpha * 0.88).toFixed(2)})`);
          } else {
            const lavAlpha = (0.22 + rim * 0.35).toFixed(2);
            const pearlAlpha = (0.65 + specular * 0.35).toFixed(2);
            grad.addColorStop(0, `rgba(255, 255, 255, ${pearlAlpha})`);
            grad.addColorStop(0.5, `rgba(167, 139, 250, ${lavAlpha})`);
            grad.addColorStop(1, `rgba(224, 231, 255, ${(pearlAlpha * 0.85).toFixed(2)})`);
          }

          ctx.fillStyle = grad;
          ctx.fill();

          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.45 + specular * 0.55).toFixed(2)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (item.type === 'sphere') {
          const sph = item;
          if (sph.sx < -120 || sph.sx > width + 120 || sph.sy < -120 || sph.sy > height + 120) return;

          ctx.save();
          const r = Math.max(sph.r, 4);

          // Subtle soft ambient drop shadow beneath floating glass sphere
          ctx.beginPath();
          ctx.ellipse(sph.sx + 2, sph.sy + r * 0.88, r * 0.72, r * 0.24, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.045)';
          ctx.fill();

          // Translucent glass sphere body with realistic refraction gradient
          ctx.beginPath();
          ctx.arc(sph.sx, sph.sy, r, 0, Math.PI * 2);

          const glassGrad = ctx.createRadialGradient(
            sph.sx - r * 0.35,
            sph.sy - r * 0.35,
            r * 0.08,
            sph.sx,
            sph.sy,
            r
          );

          if (sph.tint === 'crimson') {
            glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
            glassGrad.addColorStop(0.25, 'rgba(255, 240, 240, 0.6)');
            glassGrad.addColorStop(0.7, 'rgba(220, 38, 38, 0.2)');
            glassGrad.addColorStop(1, 'rgba(239, 68, 68, 0.44)');
          } else if (sph.tint === 'gold') {
            glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
            glassGrad.addColorStop(0.25, 'rgba(255, 252, 235, 0.6)');
            glassGrad.addColorStop(0.7, 'rgba(217, 119, 6, 0.2)');
            glassGrad.addColorStop(1, 'rgba(245, 158, 11, 0.44)');
          } else if (sph.tint === 'lavender') {
            glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
            glassGrad.addColorStop(0.25, 'rgba(245, 243, 255, 0.6)');
            glassGrad.addColorStop(0.7, 'rgba(167, 139, 250, 0.2)');
            glassGrad.addColorStop(1, 'rgba(196, 181, 253, 0.42)');
          } else {
            glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.97)');
            glassGrad.addColorStop(0.25, 'rgba(248, 250, 252, 0.6)');
            glassGrad.addColorStop(0.7, 'rgba(226, 232, 240, 0.18)');
            glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.48)');
          }

          ctx.fillStyle = glassGrad;
          ctx.fill();

          // Crisp Fresnel rim ring
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Secondary caustic internal bounce
          ctx.beginPath();
          ctx.arc(sph.sx + r * 0.28, sph.sy + r * 0.28, r * 0.34, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
          ctx.fill();

          ctx.restore();
        }
      });

      // =======================================================================
      // LAYER 4: VOICE PARTICLES TRAVELLING ALONG COMMUNICATION PATHS
      // =======================================================================
      particles.forEach((part) => {
        part.t = (part.t + part.speed) % 1;
        const pt = getCurvePoint(part.t, part.loop, time);

        const rotated = applySceneRotation([pt[0] + part.offset, pt[1] + part.offset, pt[2]]);
        const [sx, sy, scale] = project(rotated);
        const r = part.size * scale;

        if (sx >= -50 && sx <= width + 50 && sy >= -50 && sy <= height + 50) {
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);

          let particleColor = `rgba(220, 38, 38, ${(part.opacity * scale).toFixed(3)})`;
          let shadowCol = 'rgba(220, 38, 38, 0.5)';
          if (part.loop === 1) {
            particleColor = `rgba(217, 119, 6, ${(part.opacity * scale).toFixed(3)})`;
            shadowCol = 'rgba(245, 158, 11, 0.5)';
          } else if (part.loop === 2) {
            particleColor = `rgba(167, 139, 250, ${(part.opacity * scale).toFixed(3)})`;
            shadowCol = 'rgba(167, 139, 250, 0.5)';
          }

          ctx.fillStyle = particleColor;
          ctx.shadowColor = shadowCol;
          ctx.shadowBlur = 8 * scale;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="connected-communication-3d-root"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
      {/* Centered soft frosted aura ensuring 100% typography contrast while allowing expansive outer 3D elements to shine */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 253, 248, 0.82) 0%, rgba(255, 253, 248, 0.55) 42%, rgba(255, 253, 248, 0.1) 75%, rgba(255, 253, 248, 0) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
