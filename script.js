(() => {
  'use strict';

  const mainDisplay = document.getElementById('mainDisplay');
  const expressionDisplay = document.getElementById('expressionDisplay');
  const meterBar = document.getElementById('displayMeterBar');
  const keypad = document.getElementById('keypad');
  const calculator = document.getElementById('calculator');
  const flashLayer = document.getElementById('flashLayer');
  const toast = document.getElementById('toast');
  const voicePanel = document.getElementById('voicePanel');
  const voiceButton = document.getElementById('voiceButton');
  const voiceButtonLabel = document.getElementById('voiceButtonLabel');
  const voiceState = document.getElementById('voiceState');
  const voiceStatus = document.getElementById('voiceStatus');
  const voiceTranscript = document.getElementById('voiceTranscript');
  const particleCanvas = document.getElementById('particleCanvas');
  const particleContext = particleCanvas.getContext('2d');
  const fireworksCanvas = document.getElementById('fireworksCanvas');
  const fireworksContext = fireworksCanvas.getContext('2d');

  let currentValue = '0';
  let expressionText = '';
  let previousValue = null;
  let operator = null;
  let waitingForOperand = false;
  let toastTimer = null;
  let currentTheme = null;
  let particleCanvasRatio = 1;
  let fireworksCanvasRatio = 1;
  let fireworksLaunchedCount = 0;
  let fireworksTargetCount = 0;
  let nextFireworkTime = 0;
  let fireworksAnimationId = null;
  let lastFireworksFrame = 0;
  let fireworksCompletionCallback = null;
  let voiceRecognition = null;
  let voiceRecognitionActive = false;
  let voiceFinalTranscript = '';
  let voiceInactivityTimer = null;
  let voiceTranscriptResetTimer = null;
  let voiceErrorResetTimer = null;
  let currentVoiceState = 'IDLE';
  let voiceStopRequested = false;
  let voiceListeningRequested = false;
  let voiceRecognitionStartPending = false;
  let voiceRestartTimer = null;
  let voiceMicrophoneStream = null;
  let voicePermissionRequest = null;
  let voiceEvaluationPending = false;
  let calculatorInputLocked = false;
  const VOICE_INACTIVITY_TIMEOUT = 30000;
  const VOICE_RESTART_DELAY = 100;

  const FIREWORK_FRAME_INTERVAL = 1000 / 30;
  const FIREWORK_LAUNCH_COUNT = 5; // Equal button: launch exactly five fireworks
  const FIREWORK_LAUNCH_INTERVAL = 1000; // One-second interval between launches
  const FIREWORK_LAUNCH_ANGLE = 90;
  const FIREWORK_EXPLOSION_SCALE = 3;
  const MAX_FIREWORK_ROCKETS = 4;
  const MAX_FIREWORK_SPARKS = 420;
  const VOICE_KEY_GLOW_DURATION = 520;

  const flowerTypes = [
    'sakura',
    'rose',
    'chrysanthemum',
    'lily',
    'lotus',
    'sunflower'
  ];

  const particles = [];
  const ambientParticles = [];
  const fireworkRockets = [];
  const fireworkSparks = [];
  const voiceFeedbackTimers = new Set();

  const themes = [
    'rainbow',
    'plasma',
    'gold',
    'lime',
    'sakura',
    'ocean',
    'inferno',
    'ice',
    'candy',
    'royal'
  ];

  function resizeCanvas(canvas, context, ratio) {
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function resizeCanvases() {
    particleCanvasRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    fireworksCanvasRatio = Math.min(window.devicePixelRatio || 1, 1.15);

    resizeCanvas(particleCanvas, particleContext, particleCanvasRatio);
    resizeCanvas(fireworksCanvas, fireworksContext, fireworksCanvasRatio);

    if (ambientParticles.length === 0) {
      const ambientCount = window.innerWidth < 700 ? 22 : 32;
      for (let index = 0; index < ambientCount; index += 1) {
        ambientParticles.push(createAmbientParticle());
      }
    }
  }

  function createAmbientParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: Math.random() * -0.4 - 0.12,
      alpha: Math.random() * 0.55 + 0.2,
      hue: Math.floor(Math.random() * 360)
    };
  }

  function getThemeColors() {
    const styles = getComputedStyle(document.body);
    return [
      styles.getPropertyValue('--cyan').trim(),
      styles.getPropertyValue('--pink').trim(),
      styles.getPropertyValue('--yellow').trim(),
      styles.getPropertyValue('--violet').trim(),
      styles.getPropertyValue('--orange').trim(),
      styles.getPropertyValue('--blue').trim(),
      '#ffffff'
    ].filter(Boolean);
  }

  function animateParticles() {
    particleContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const particle of ambientParticles) {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.hue = (particle.hue + 0.4) % 360;

      if (particle.y < -10) {
        particle.y = window.innerHeight + 10;
        particle.x = Math.random() * window.innerWidth;
      }
      if (particle.x < -10) particle.x = window.innerWidth + 10;
      if (particle.x > window.innerWidth + 10) particle.x = -10;

      particleContext.beginPath();
      particleContext.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.alpha})`;
      particleContext.shadowBlur = 16;
      particleContext.shadowColor = `hsla(${particle.hue}, 100%, 65%, .9)`;
      particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      particleContext.fill();
    }

    particleContext.shadowBlur = 0;

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.rotation += particle.rotationSpeed;
      particle.life -= particle.decay;

      particleContext.save();
      particleContext.translate(particle.x, particle.y);
      particleContext.rotate(particle.rotation);
      particleContext.globalAlpha = Math.max(particle.life, 0);
      particleContext.fillStyle = particle.color;
      particleContext.shadowBlur = 12;
      particleContext.shadowColor = particle.color;
      particleContext.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.55);
      particleContext.restore();

      if (particle.life <= 0 || particle.y > window.innerHeight + 50) {
        particles.splice(index, 1);
      }
    }

    particleContext.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
  }

  function launchConfetti(intensity = 90) {
    const rect = calculator.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height * 0.35;
    const colors = getThemeColors();

    for (let index = 0; index < intensity; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        gravity: 0.16 + Math.random() * 0.08,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: Math.random() * 0.012 + 0.012
      });
    }
  }

  function launchFirework() {
    if (fireworkRockets.length >= MAX_FIREWORK_ROCKETS) return false;

    const colors = getThemeColors();
    const color = colors[Math.floor(Math.random() * colors.length)];
    const accentColor = colors[Math.floor(Math.random() * colors.length)];
    const launchAngle = FIREWORK_LAUNCH_ANGLE;
    const launchRadians = launchAngle * Math.PI / 180;
    const launchSpeed = 9.2 + Math.random() * 2.2;
    const x = window.innerWidth * (0.14 + Math.random() * 0.72);

    fireworkRockets.push({
      x,
      y: window.innerHeight + 12,
      previousX: x,
      previousY: window.innerHeight + 12,
      vx: Math.cos(launchRadians) * launchSpeed,
      vy: -Math.sin(launchRadians) * launchSpeed,
      targetY: window.innerHeight * (0.1 + Math.random() * 0.42),
      color,
      accentColor,
      flowerType: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
      rotation: Math.random() * Math.PI * 2,
      size: 2 + Math.random() * 1.3,
      launchAngle
    });

    return true;
  }

  function getFlowerRadius(type, angle, layer) {
    switch (type) {
      case 'sakura':
        return 0.34 + 0.66 * (0.5 + 0.5 * Math.cos(5 * angle));
      case 'rose':
        return 0.43 + 0.42 * (0.5 + 0.5 * Math.cos(7 * angle + layer * 0.9));
      case 'chrysanthemum':
        return 0.55 + 0.45 * (0.5 + 0.5 * Math.cos(18 * angle + layer * 0.45));
      case 'lily':
        return 0.28 + 0.72 * (0.5 + 0.5 * Math.cos(6 * angle));
      case 'lotus':
        return 0.4 + 0.6 * Math.abs(Math.cos(4 * angle + layer * 0.35));
      case 'sunflower':
        return 0.5 + 0.5 * (0.5 + 0.5 * Math.cos(12 * angle));
      default:
        return 1;
    }
  }

  function getFlowerSparkCount(type) {
    const compact = window.innerWidth < 700;
    const counts = {
      sakura: compact ? 34 : 46,
      rose: compact ? 38 : 50,
      chrysanthemum: compact ? 42 : 58,
      lily: compact ? 34 : 46,
      lotus: compact ? 36 : 48,
      sunflower: compact ? 40 : 54
    };
    return counts[type] || (compact ? 34 : 46);
  }

  function pushFlowerSpark(rocket, angle, speed, color, options = {}) {
    const verticalScale = options.verticalScale || 0.9;
    const jitter = options.jitter || 0;
    const adjustedAngle = angle + (Math.random() - 0.5) * jitter;
    const adjustedSpeed = speed * (0.96 + Math.random() * 0.08);

    fireworkSparks.push({
      x: rocket.x,
      y: rocket.y,
      previousX: rocket.x,
      previousY: rocket.y,
      vx: Math.cos(adjustedAngle) * adjustedSpeed,
      vy: Math.sin(adjustedAngle) * adjustedSpeed * verticalScale,
      gravity: options.gravity || (0.052 + Math.random() * 0.018),
      friction: options.friction || (0.978 + Math.random() * 0.008),
      life: options.life || 1,
      decay: options.decay || (0.018 + Math.random() * 0.009),
      color,
      size: options.size || (1 + Math.random() * 1.5)
    });
  }

  function explodeFirework(rocket) {
    const remainingCapacity = MAX_FIREWORK_SPARKS - fireworkSparks.length;
    if (remainingCapacity <= 0) return;

    const flowerType = rocket.flowerType;
    const requestedCount = getFlowerSparkCount(flowerType);
    const sparkCount = Math.min(requestedCount, remainingCapacity);
    const layers = flowerType === 'rose' || flowerType === 'chrysanthemum' ? 2 : 1;
    const outerCount = Math.max(1, Math.floor(sparkCount * 0.82));

    for (let index = 0; index < outerCount; index += 1) {
      const layer = index % layers;
      const baseAngle = (Math.PI * 2 * index) / outerCount;
      const angle = baseAngle + rocket.rotation + layer * 0.12;
      const radius = getFlowerRadius(flowerType, baseAngle, layer);
      const layerScale = layer === 0 ? 1 : 0.73;
      const speed = (2.6 + radius * 3.6) * layerScale * FIREWORK_EXPLOSION_SCALE;
      const color = index % 4 === 0 ? rocket.accentColor : rocket.color;

      pushFlowerSpark(rocket, angle, speed, color, {
        verticalScale: flowerType === 'lily' ? 1.05 : 0.9,
        jitter: flowerType === 'chrysanthemum' ? 0.035 : 0.018,
        decay: flowerType === 'chrysanthemum' ? 0.016 + Math.random() * 0.007 : 0.019 + Math.random() * 0.008,
        size: flowerType === 'chrysanthemum' ? 0.85 + Math.random() * 1.1 : 1 + Math.random() * 1.5
      });
    }

    const centerCount = Math.min(sparkCount - outerCount, MAX_FIREWORK_SPARKS - fireworkSparks.length);
    for (let index = 0; index < centerCount; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (flowerType === 'sunflower'
        ? 0.7 + Math.random() * 1.8
        : 1 + Math.random() * 2.4) * FIREWORK_EXPLOSION_SCALE;
      pushFlowerSpark(rocket, angle, speed, index % 2 ? rocket.color : rocket.accentColor, {
        verticalScale: 0.92,
        gravity: 0.045 + Math.random() * 0.014,
        decay: 0.022 + Math.random() * 0.008,
        size: 0.9 + Math.random() * 1.25
      });
    }

    flashLayer.classList.remove('firework-flash');
    void flashLayer.offsetWidth;
    flashLayer.classList.add('firework-flash');
  }

  function stopFireworks(notifyCompletion = true) {
    if (fireworksAnimationId !== null) {
      cancelAnimationFrame(fireworksAnimationId);
      fireworksAnimationId = null;
    }
    fireworkRockets.length = 0;
    fireworkSparks.length = 0;
    particles.length = 0;
    fireworksLaunchedCount = 0;
    fireworksTargetCount = 0;
    nextFireworkTime = 0;
    lastFireworksFrame = 0;
    fireworksContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
    flashLayer.classList.remove('firework-flash');

    if (notifyCompletion && fireworksCompletionCallback) {
      const completionCallback = fireworksCompletionCallback;
      fireworksCompletionCallback = null;
      completionCallback();
    }
  }

  function startFireworks(totalLaunches = FIREWORK_LAUNCH_COUNT, onComplete = null) {
    stopFireworks(false);
    fireworksCompletionCallback = onComplete;

    const now = performance.now();
    fireworksTargetCount = Math.max(1, Math.floor(totalLaunches));
    fireworksLaunchedCount = 0;
    nextFireworkTime = now;

    if (launchFirework()) {
      fireworksLaunchedCount += 1;
      nextFireworkTime = now + FIREWORK_LAUNCH_INTERVAL;
    }

    fireworksAnimationId = requestAnimationFrame(animateFireworks);
  }

  function animateFireworks(timestamp) {
    const elapsed = lastFireworksFrame === 0 ? FIREWORK_FRAME_INTERVAL : timestamp - lastFireworksFrame;
    if (elapsed < FIREWORK_FRAME_INTERVAL) {
      fireworksAnimationId = requestAnimationFrame(animateFireworks);
      return;
    }
    const frameScale = Math.min(2.5, elapsed / (1000 / 60));
    lastFireworksFrame = timestamp;

    fireworksContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
    fireworksContext.save();
    fireworksContext.globalCompositeOperation = 'lighter';
    fireworksContext.lineCap = 'round';

    if (fireworksLaunchedCount < fireworksTargetCount && timestamp >= nextFireworkTime) {
      if (launchFirework()) {
        fireworksLaunchedCount += 1;
        nextFireworkTime = timestamp + FIREWORK_LAUNCH_INTERVAL;
      } else {
        nextFireworkTime = timestamp + 60;
      }
    }

    for (let index = fireworkRockets.length - 1; index >= 0; index -= 1) {
      const rocket = fireworkRockets[index];
      rocket.previousX = rocket.x;
      rocket.previousY = rocket.y;
      rocket.x += rocket.vx * frameScale;
      rocket.y += rocket.vy * frameScale;
      rocket.vy += 0.095 * frameScale;

      fireworksContext.globalAlpha = 0.8;
      fireworksContext.strokeStyle = rocket.color;
      fireworksContext.lineWidth = Math.max(1, rocket.size * 0.8);
      fireworksContext.shadowBlur = 8;
      fireworksContext.shadowColor = rocket.color;
      fireworksContext.beginPath();
      fireworksContext.moveTo(rocket.previousX, rocket.previousY + 8);
      fireworksContext.lineTo(rocket.x, rocket.y);
      fireworksContext.stroke();

      fireworksContext.globalAlpha = 1;
      fireworksContext.fillStyle = rocket.color;
      fireworksContext.beginPath();
      fireworksContext.arc(rocket.x, rocket.y, rocket.size, 0, Math.PI * 2);
      fireworksContext.fill();

      if (rocket.y <= rocket.targetY || rocket.vy >= -1.4) {
        explodeFirework(rocket);
        fireworkRockets.splice(index, 1);
      }
    }

    fireworksContext.shadowBlur = 5;
    for (let index = fireworkSparks.length - 1; index >= 0; index -= 1) {
      const spark = fireworkSparks[index];
      spark.previousX = spark.x;
      spark.previousY = spark.y;
      const scaledFriction = Math.pow(spark.friction, frameScale);
      spark.vx *= scaledFriction;
      spark.vy = spark.vy * scaledFriction + spark.gravity * frameScale;
      spark.x += spark.vx * frameScale;
      spark.y += spark.vy * frameScale;
      spark.life -= spark.decay * frameScale;

      fireworksContext.lineWidth = spark.size;
      fireworksContext.strokeStyle = spark.color;
      fireworksContext.shadowColor = spark.color;
      fireworksContext.globalAlpha = Math.max(0, spark.life);
      fireworksContext.beginPath();
      fireworksContext.moveTo(spark.previousX, spark.previousY);
      fireworksContext.lineTo(spark.x, spark.y);
      fireworksContext.stroke();

      if (spark.life <= 0 || spark.y > window.innerHeight + 30) {
        fireworkSparks.splice(index, 1);
      }
    }

    fireworksContext.restore();
    fireworksContext.globalAlpha = 1;
    fireworksContext.shadowBlur = 0;

    const launchesPending = fireworksLaunchedCount < fireworksTargetCount;
    if (launchesPending || fireworkRockets.length > 0 || fireworkSparks.length > 0) {
      fireworksAnimationId = requestAnimationFrame(animateFireworks);
    } else {
      stopFireworks();
    }
  }

  function getOperatorSymbol(selectedOperator) {
    const symbols = { '+': '＋', '-': '−', '*': '×', '/': '÷' };
    return symbols[selectedOperator] || selectedOperator || '';
  }

  function updateExpressionForCurrentInput() {
    if (operator && previousValue !== null && !waitingForOperand) {
      expressionText = `${formatValue(previousValue)} ${getOperatorSymbol(operator)} ${formatValue(currentValue)}`;
    }
  }

  function formatValue(value) {
    if (value === 'Error') return value;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 'Error';

    const abs = Math.abs(numeric);
    if (abs >= 1e12 || (abs > 0 && abs < 1e-8)) {
      return numeric.toExponential(7).replace(/\.0+e/, 'e');
    }

    const [integerPart, decimalPart] = String(value).split('.');
    const formattedInteger = Number(integerPart).toLocaleString('ja-JP');
    return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }

  function updateDisplay(animate = false) {
    expressionDisplay.textContent = expressionText;
    expressionDisplay.classList.toggle('is-empty', expressionText === '');
    mainDisplay.textContent = formatValue(currentValue);

    const digitCount = currentValue.replace(/[^0-9]/g, '').length;
    meterBar.style.width = `${Math.min(100, 18 + digitCount * 7)}%`;

    if (animate) {
      mainDisplay.classList.remove('burst');
      void mainDisplay.offsetWidth;
      mainDisplay.classList.add('burst');
    }
  }

  function inputDigit(digit) {
    if (waitingForOperand && operator === null && previousValue === null) {
      expressionText = '';
    }
    if (currentValue === 'Error' || waitingForOperand) {
      currentValue = digit;
      waitingForOperand = false;
    } else if (currentValue === '0') {
      currentValue = digit;
    } else if (currentValue.replace(/[^0-9]/g, '').length < 14) {
      currentValue += digit;
    }
    updateExpressionForCurrentInput();
    updateDisplay();
  }

  function inputDecimal() {
    if (waitingForOperand && operator === null && previousValue === null) {
      expressionText = '';
    }
    if (currentValue === 'Error' || waitingForOperand) {
      currentValue = '0.';
      waitingForOperand = false;
    } else if (!currentValue.includes('.')) {
      currentValue += '.';
    }
    updateExpressionForCurrentInput();
    updateDisplay();
  }

  function calculate(left, right, selectedOperator) {
    switch (selectedOperator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return right === 0 ? NaN : left / right;
      default: return right;
    }
  }

  function normalizeResult(result) {
    if (!Number.isFinite(result)) return 'Error';
    const rounded = Math.round((result + Number.EPSILON) * 1e10) / 1e10;
    return String(rounded);
  }

  function chooseOperator(nextOperator) {
    if (currentValue === 'Error') {
      clearAll();
      return;
    }

    const inputValue = Number(currentValue);

    if (operator && previousValue !== null && !waitingForOperand) {
      const result = calculate(Number(previousValue), inputValue, operator);
      currentValue = normalizeResult(result);
      previousValue = currentValue === 'Error' ? null : currentValue;
      if (currentValue === 'Error') {
        handleError('0では割れません');
        return;
      }
    } else {
      previousValue = currentValue;
    }

    operator = nextOperator;
    waitingForOperand = true;
    expressionText = `${formatValue(previousValue)} ${getOperatorSymbol(operator)}`;
    updateDisplay(true);
  }

  function evaluate() {
    if (!operator || previousValue === null || currentValue === 'Error') {
      pulseCalculator();
      triggerMegaEffect(calculatorInputLocked ? unlockCalculatorInput : null);
      return;
    }

    const leftText = previousValue;
    const rightText = currentValue;
    const selectedOperator = operator;
    const result = calculate(Number(leftText), Number(rightText), selectedOperator);
    const normalized = normalizeResult(result);

    if (normalized === 'Error') {
      handleError('0では割れません');
      triggerMegaEffect(calculatorInputLocked ? unlockCalculatorInput : null);
      return;
    }

    expressionText = `${formatValue(leftText)} ${getOperatorSymbol(selectedOperator)} ${formatValue(rightText)} ＝`;
    currentValue = normalized;
    previousValue = null;
    operator = null;
    waitingForOperand = true;

    updateDisplay(true);
    triggerMegaEffect(calculatorInputLocked ? unlockCalculatorInput : null);
  }

  function percent() {
    if (currentValue === 'Error') return;
    const percentSource = currentValue;
    currentValue = normalizeResult(Number(currentValue) / 100);
    expressionText = `${formatValue(percentSource)} %`;
    updateDisplay(true);
    pulseCalculator();
  }

  function backspace() {
    if (waitingForOperand || currentValue === 'Error') return;
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
    if (currentValue === '-' || currentValue === '') currentValue = '0';
    updateExpressionForCurrentInput();
    updateDisplay();
  }

  function clearAll(changeTheme = false) {
    stopFireworks();
    flashLayer.classList.remove('active', 'firework-flash');

    currentValue = '0';
    expressionText = '';
    previousValue = null;
    operator = null;
    waitingForOperand = false;

    if (changeTheme) {
      applyRandomTheme(true);
    }

    updateDisplay(true);
    showToast('SYSTEM RESET');
  }

  function handleError(message) {
    expressionText = '';
    currentValue = 'Error';
    previousValue = null;
    operator = null;
    waitingForOperand = true;
    updateDisplay(true);
    calculator.classList.remove('shake');
    void calculator.offsetWidth;
    calculator.classList.add('shake');
    showToast(message);
  }

  function pulseCalculator() {
    calculator.classList.remove('overdrive');
    void calculator.offsetWidth;
    calculator.classList.add('overdrive');
  }

  function triggerMegaEffect(onComplete = null) {
    pulseCalculator();
    stopFireworks(false);
    launchConfetti(120);
    startFireworks(FIREWORK_LAUNCH_COUNT, onComplete);
    flashLayer.classList.remove('active');
    void flashLayer.offsetWidth;
    flashLayer.classList.add('active');
    showToast('FIREWORK CALCULATION!');
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1700);
  }

  function createRipple(button, event) {
    const rect = button.getBoundingClientRect();
    const clientX = event.clientX || rect.left + rect.width / 2;
    const clientY = event.clientY || rect.top + rect.height / 2;
    button.style.setProperty('--ripple-x', `${clientX - rect.left}px`);
    button.style.setProperty('--ripple-y', `${clientY - rect.top}px`);
    button.classList.remove('ripple');
    void button.offsetWidth;
    button.classList.add('ripple');
  }

  function processButton(button, event = {}) {
    if (!button || calculatorInputLocked) return;

    createRipple(button, event);

    if (button.dataset.number !== undefined) {
      inputDigit(button.dataset.number);
    } else if (button.dataset.operator) {
      chooseOperator(button.dataset.operator);
    } else {
      const action = button.dataset.action;
      if (action === 'clear') {
        resetVoiceInput();
        clearAll(true);
      }
      if (action === 'backspace') backspace();
      if (action === 'percent') percent();
      if (action === 'decimal') inputDecimal();
      if (action === 'equals') evaluate();
    }
  }

  const voiceStateText = {
      IDLE: ['READY', 'マイクを押して話してください'],
      REQUESTING: ['REQUESTING', 'マイクの使用許可を確認しています'],
      LISTENING: ['LISTENING', '認識中…'],
      PROCESSING: ['PROCESSING', '音声を解析しています…'],
      SUCCESS: ['SUCCESS', '認識しました'],
      LOCKED: ['LOCKED', '花火演出中は入力できません'],
      ERROR: ['ERROR', '音声入力でエラーが発生しました'],
      UNSUPPORTED: ['UNSUPPORTED', 'この環境では音声入力を利用できません']
    };

  function setVoiceState(nextState, message = null) {
      const [label, defaultMessage] = voiceStateText[nextState];
      currentVoiceState = nextState;
      window.clearTimeout(voiceErrorResetTimer);
      voicePanel.className = `voice-panel is-${nextState.toLowerCase()}`;
      voiceState.textContent = label;
      voiceStatus.textContent = message || defaultMessage;
      const listening = nextState === 'LISTENING' || nextState === 'REQUESTING';
      voiceButton.classList.toggle('is-listening', listening);
      voiceButton.setAttribute('aria-pressed', String(listening));
      voiceButtonLabel.textContent = listening ? '停止' : '音声入力';
      voiceButton.setAttribute('aria-label', listening ? '音声入力を停止' : '音声入力を開始');
      if (nextState === 'ERROR') {
        voiceErrorResetTimer = window.setTimeout(() => {
          setVoiceTranscript('');
          setVoiceState('IDLE');
        }, 3000);
      }
    }

  function setVoiceTranscript(text) {
      voiceTranscript.textContent = `認識: ${text || '—'}`;
    }

  function scheduleVoiceFeedback(callback, delay) {
    let timerId = null;
    timerId = window.setTimeout(() => {
      voiceFeedbackTimers.delete(timerId);
      callback();
    }, delay);
    voiceFeedbackTimers.add(timerId);
  }

  function clearVoiceFeedback() {
    voiceFeedbackTimers.forEach(timerId => window.clearTimeout(timerId));
    voiceFeedbackTimers.clear();
    document.querySelectorAll('.voice-active').forEach(key => key.classList.remove('voice-active'));
  }

  function hasLiveVoiceMicrophoneStream() {
    return voiceMicrophoneStream
      && voiceMicrophoneStream.getTracks().some(track => track.readyState === 'live');
  }

  function ensureVoiceMicrophoneAccess() {
    if (hasLiveVoiceMicrophoneStream() || !navigator.mediaDevices
      || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      return Promise.resolve();
    }
    if (voicePermissionRequest) return voicePermissionRequest;

    voicePermissionRequest = navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        voiceMicrophoneStream = stream;
      })
      .finally(() => {
        voicePermissionRequest = null;
      });
    return voicePermissionRequest;
  }

  function releaseVoiceMicrophoneAccess() {
    if (!voiceMicrophoneStream) return;
    voiceMicrophoneStream.getTracks().forEach(track => track.stop());
    voiceMicrophoneStream = null;
  }

  function unlockCalculatorInput() {
    calculatorInputLocked = false;
    voiceEvaluationPending = false;
    if (!voiceRecognition) return;

    voiceButton.disabled = false;
    setVoiceState('LISTENING');
    startVoiceRecognition();
  }

  function lockCalculatorInputUntilFireworksComplete() {
    calculatorInputLocked = true;
    voiceButton.disabled = true;
    setVoiceState('LOCKED');
  }

  function lockForSpokenEvaluation() {
    if (calculatorInputLocked) return;
    voiceEvaluationPending = true;
    lockCalculatorInputUntilFireworksComplete();
  }

  function resetVoiceInput() {
      window.clearTimeout(voiceInactivityTimer);
      window.clearTimeout(voiceTranscriptResetTimer);
      clearVoiceFeedback();
      voiceListeningRequested = false;
      voiceEvaluationPending = false;
      releaseVoiceMicrophoneAccess();
      window.clearTimeout(voiceRestartTimer);
      voiceRestartTimer = null;
      voiceRecognitionStartPending = false;
      voiceStopRequested = true;
      if (voiceRecognitionActive && voiceRecognition) {
        voiceRecognition.stop();
      }
      voiceRecognitionActive = false;
      voiceFinalTranscript = '';
      setVoiceTranscript('');
      setVoiceState('IDLE');
    }

  function scheduleVoiceTranscriptReset() {
      window.clearTimeout(voiceTranscriptResetTimer);
      voiceTranscriptResetTimer = window.setTimeout(() => {
        setVoiceTranscript('');
      }, 1000);
    }

  function prepareVoiceSession() {
      window.clearTimeout(voiceTranscriptResetTimer);
      voiceFinalTranscript = '';
      setVoiceTranscript('');
    }

  function resetVoiceInactivityTimer() {
      window.clearTimeout(voiceInactivityTimer);
      voiceInactivityTimer = window.setTimeout(() => {
        if (!calculatorInputLocked) setVoiceState('IDLE');
      }, VOICE_INACTIVITY_TIMEOUT);
    }

  function scheduleVoiceRecognitionRestart() {
    if (
      !voiceRecognition ||
      calculatorInputLocked ||
      !voiceListeningRequested ||
      voiceRecognitionActive ||
      voiceRecognitionStartPending ||
      voiceRestartTimer !== null
    ) return;

    voiceRestartTimer = window.setTimeout(() => {
      voiceRestartTimer = null;
      startVoiceRecognition();
    }, VOICE_RESTART_DELAY);
  }

  function startVoiceRecognition() {
    if (
      !voiceRecognition ||
      calculatorInputLocked ||
      !voiceListeningRequested ||
      voiceRecognitionActive ||
      voiceRecognitionStartPending
    ) return;

    window.clearTimeout(voiceRestartTimer);
    voiceRestartTimer = null;
    voiceRecognitionStartPending = true;
    try {
      voiceRecognition.start();
    } catch (error) {
      voiceRecognitionStartPending = false;
      if (error.name === 'InvalidStateError') {
        scheduleVoiceRecognitionRestart();
        return;
      }
      voiceListeningRequested = false;
      setVoiceState('ERROR', '音声入力を開始できませんでした');
    }
  }

  function normalizeVoiceText(text) {
      let normalized = text
        .normalize('NFKC')
        .replace(/[、。,!?！？「」『』]/g, '')
        .replace(/\s+/g, '')
        .replace(/は$/, '');
      const spokenDigits = {
        れい: 0, ぜろ: 0, いち: 1, に: 2, さん: 3, よん: 4, し: 4,
        ご: 5, ろく: 6, なな: 7, しち: 7, はち: 8, きゅう: 9
      };
      const parseSpokenInteger = value => {
        if (spokenDigits[value] !== undefined) return String(spokenDigits[value]);
        if (value === 'じゅう') return '10';
        const tensMatch = value.match(/^(いち|に|さん|よん|し|ご|ろく|なな|しち|はち|きゅう)?じゅう(れい|ぜろ|いち|に|さん|よん|し|ご|ろく|なな|しち|はち|きゅう)?$/);
        if (!tensMatch) return value;
        const tens = tensMatch[1] ? spokenDigits[tensMatch[1]] * 10 : 10;
        const ones = tensMatch[2] ? spokenDigits[tensMatch[2]] : 0;
        return String(tens + ones);
      };
      normalized = normalized.replace(
        /(いち|に|さん|よん|し|ご|ろく|なな|しち|はち|きゅう)?じゅう(れい|ぜろ|いち|に|さん|よん|し|ご|ろく|なな|しち|はち|きゅう)?てん(れい|ぜろ|いち|に|さん|よん|し|ご|ろく|なな|しち|はち|きゅう)/g,
        (_, tensDigit, onesDigit, decimalDigit) => `${parseSpokenInteger(`${tensDigit || ''}じゅう${onesDigit || ''}`)}.${spokenDigits[decimalDigit]}`
      );
      normalized = normalized.replace(
        /(れい|ぜろ|いち|に|さん|よん|し|ご|ろく|なな|しち|はち|きゅう)てん(れい|ぜろ|いち|に|さん|よん|し|ご|ろく|なな|しち|はち|きゅう)/g,
        (_, integerDigit, decimalDigit) => `${spokenDigits[integerDigit]}.${spokenDigits[decimalDigit]}`
      );
      // Treat every remaining spoken decimal marker as a period.
      normalized = normalized.replace(/てん|点/g, '.');

      const replacements = [
        ['じゅういち', '11'], ['じゅうに', '12'], ['じゅうさん', '13'], ['じゅうよん', '14'],
        ['じゅうご', '15'], ['じゅうろく', '16'], ['じゅうなな', '17'], ['じゅうはち', '18'],
        ['じゅうきゅう', '19'], ['じゅう', '10'],
        ['れい', '0'], ['ぜろ', '0'], ['いち', '1'], ['に', '2'], ['さん', '3'],
        ['よん', '4'], ['し', '4'], ['ご', '5'], ['ろく', '6'], ['なな', '7'],
        ['しち', '7'], ['はち', '8'], ['きゅう', '9'],
        ['ac', 'AC'], ['del', 'DEL'],
        ['オールクリア', 'AC'], ['クリア', 'AC'], ['リセット', 'AC'],
        ['一文字削除', 'DEL'], ['削除', 'DEL'],
        ['パーセント', '%'], ['イコール', '='], ['計算して', '='], ['計算', '='], ['結果', '='],
        ['プラス', '+'], ['足す', '+'], ['たす', '+'],
        ['マイナス', '-'], ['引く', '-'], ['ひく', '-'],
        ['かける', '*'], ['掛ける', '*'], ['乗算', '*'],
        ['わる', '/'], ['割る', '/'], ['除算', '/'],
        ['ドット', '.'],
        ['％', '%'], ['＋', '+'], ['−', '-'], ['×', '*'], ['÷', '/'], ['＝', '=']
      ];
      replacements.forEach(([from, to]) => {
        normalized = normalized.split(from).join(to);
      });
      return normalized.replace(/(AC|DEL|[+\-*\/%=])/g, '$1');
    }

  function parseJapaneseNumber(text) {
      const smallDigits = { '零': 0, '〇': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
      const units = { '十': 10, '百': 100, '千': 1000 };
      if (!/^[零〇一二三四五六七八九十百千]+$/.test(text)) return text;
      let total = 0;
      let section = 0;
      let digit = 0;
      for (const character of text) {
        if (smallDigits[character] !== undefined) {
          digit = smallDigits[character];
        } else if (units[character]) {
          section += (digit || 1) * units[character];
          digit = 0;
        }
      }
      return String(total + section + digit);
    }

  function endsWithVoiceEvaluationMarker(text) {
    return /(?:=|＝|イコール|計算して|計算|結果)\s*$/.test(text);
  }

  function parseVoiceCommand(rawText) {
      const normalized = normalizeVoiceText(rawText);
      if (['AC', 'DEL', '%', '='].includes(normalized)) return { type: 'action', action: normalized };

      const numericText = normalized.replace(/[零〇一二三四五六七八九十百千]+/g, match => parseJapaneseNumber(match));
      const hasEvaluationMarker = endsWithVoiceEvaluationMarker(rawText);
      const relativeExpressionMatch = numericText.match(/^([+\-*\/])(\d+(?:\.\d+)?)(=)?$/);
      if (relativeExpressionMatch) {
        return {
          type: 'relative-expression',
          operator: relativeExpressionMatch[1],
          right: relativeExpressionMatch[2],
          evaluate: Boolean(relativeExpressionMatch[3]) || hasEvaluationMarker
        };
      }
      const expressionMatch = numericText.match(/^(\d+(?:\.\d+)?)([+\-*\/])(\d+(?:\.\d+)?)(=)?$/);
      if (expressionMatch) {
        return {
          type: 'expression',
          left: expressionMatch[1],
          operator: expressionMatch[2],
          right: expressionMatch[3],
          evaluate: Boolean(expressionMatch[4]) || hasEvaluationMarker
        };
      }
      if (/^\d+(?:\.\d+)?$/.test(numericText)) return { type: 'number', value: numericText };
      return null;
    }

  function inputVoiceNumber(value, glowDelay = 0) {
      [...value].forEach((character, index) => {
        const characterDelay = glowDelay + index * 1000;
        if (character === '.') {
          activateVoiceKey('[data-action="decimal"]', characterDelay);
          inputDecimal();
        } else {
          activateVoiceKey(`[data-number="${character}"]`, characterDelay);
          inputDigit(character);
        }
      });
      return [...value].length;
    }

  function activateVoiceKey(selector, delay = 0, onComplete = null) {
      const activate = () => {
        const key = document.querySelector(selector);
        if (!key) {
          if (onComplete) onComplete();
          return;
        }
        key.classList.remove('voice-active');
        void key.offsetWidth;
        key.classList.add('voice-active');
        scheduleVoiceFeedback(() => {
          key.classList.remove('voice-active');
          if (onComplete) onComplete();
        }, VOICE_KEY_GLOW_DURATION);
      };
      if (delay > 0) {
        scheduleVoiceFeedback(activate, delay);
        return;
      }
      const key = document.querySelector(selector);
      if (!key) return;
      key.classList.remove('voice-active');
      void key.offsetWidth;
      key.classList.add('voice-active');
      scheduleVoiceFeedback(() => {
        key.classList.remove('voice-active');
        if (onComplete) onComplete();
      }, VOICE_KEY_GLOW_DURATION);
    }

  function activateVoiceAction(action, delay = 0, onComplete = null) {
      if (action === 'AC') activateVoiceKey('[data-action="clear"]', delay);
      if (action === 'DEL') activateVoiceKey('[data-action="backspace"]', delay);
      if (action === '%') activateVoiceKey('[data-action="percent"]', delay);
      if (action === '=') activateVoiceKey('button[data-action="equals"]', delay, onComplete);
    }

  function executeVoiceCommand(rawText) {
      const isPendingEvaluation = voiceEvaluationPending;
      if (calculatorInputLocked && !isPendingEvaluation) return false;
      voiceEvaluationPending = false;
      clearVoiceFeedback();
      const command = parseVoiceCommand(rawText);
      if (!command) {
        setVoiceState('ERROR', '計算として解釈できませんでした');
        return false;
      }
      if (command.type === 'action') {
        if (command.action === '=') {
          lockCalculatorInputUntilFireworksComplete();
          activateVoiceAction(command.action, 0, evaluate);
          scheduleVoiceTranscriptReset();
          return true;
        }
        activateVoiceAction(command.action);
        if (command.action === 'AC') clearAll(true);
        if (command.action === 'DEL') backspace();
        if (command.action === '%') percent();
        return true;
      }
      if (command.type === 'number') {
        // inputDigit/inputDecimal start a fresh value after a completed evaluation.
        inputVoiceNumber(command.value);
        return true;
      }
      if (command.type === 'relative-expression') {
        const rightDelay = 1000;
        activateVoiceKey(`[data-operator="${command.operator}"]`, 0);
        chooseOperator(command.operator);
        const rightLength = inputVoiceNumber(command.right, rightDelay);
        if (command.evaluate) {
          lockCalculatorInputUntilFireworksComplete();
          activateVoiceKey(
            'button[data-action="equals"]',
            rightDelay + rightLength * 1000,
            evaluate
          );
          scheduleVoiceTranscriptReset();
        }
        if (currentValue === 'Error') {
          handleError('音声コマンドを計算できませんでした');
        }
        return true;
      }

      clearAll(false);
      const leftLength = inputVoiceNumber(command.left, 0);
      const operatorDelay = leftLength * 1000;
      activateVoiceKey(`[data-operator="${command.operator}"]`, operatorDelay);
      chooseOperator(command.operator);
      const rightDelay = operatorDelay + 1000;
      const rightLength = inputVoiceNumber(command.right, rightDelay);
      if (command.evaluate) {
        lockCalculatorInputUntilFireworksComplete();
        activateVoiceKey(
          'button[data-action="equals"]',
          rightDelay + rightLength * 1000,
          evaluate
        );
        scheduleVoiceTranscriptReset();
      }
      return true;
    }

  function voiceErrorMessage(error) {
      const messages = {
        'not-allowed': 'マイクの使用が許可されていません',
        'service-not-allowed': '音声認識サービスを利用できません',
        'audio-capture': '利用可能なマイクが見つかりません',
        'no-speech': '音声を認識できませんでした',
        network: '音声認識サービスに接続できません',
        aborted: '音声入力を終了しました'
      };
      return messages[error] || '音声入力でエラーが発生しました';
    }

  function initializeVoiceInput() {
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Recognition) {
        voiceButton.disabled = true;
        setVoiceState('UNSUPPORTED');
        return;
      }

      voiceRecognition = new Recognition();
      voiceRecognition.lang = 'ja-JP';
      voiceRecognition.continuous = true;
      voiceRecognition.interimResults = true;
      voiceRecognition.maxAlternatives = 1;

      voiceRecognition.onstart = () => {
        voiceRecognitionStartPending = false;
        voiceRecognitionActive = true;
        voiceStopRequested = false;
        if (!voiceListeningRequested) {
          voiceRecognition.stop();
          return;
        }
        setVoiceState(calculatorInputLocked ? 'LOCKED' : 'LISTENING');
        resetVoiceInactivityTimer();
      };

      voiceRecognition.onresult = event => {
        if (calculatorInputLocked && !voiceEvaluationPending) return;
        let interim = '';
        let hasFinalResult = false;
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const transcript = event.results[index][0].transcript;
          if (event.results[index].isFinal) {
            voiceFinalTranscript += transcript;
            hasFinalResult = true;
          }
          else interim += transcript;
        }
        if (!calculatorInputLocked && endsWithVoiceEvaluationMarker(`${voiceFinalTranscript}${interim}`)) {
          lockForSpokenEvaluation();
        }
        setVoiceTranscript(voiceFinalTranscript || interim);
        if (calculatorInputLocked && voiceEvaluationPending && !hasFinalResult) return;
        if (voiceFinalTranscript) {
          if (!calculatorInputLocked) setVoiceState('PROCESSING');
          const succeeded = executeVoiceCommand(voiceFinalTranscript);
          if (succeeded && !calculatorInputLocked) {
            setVoiceState('LISTENING');
          }
          voiceFinalTranscript = '';
        }
        resetVoiceInactivityTimer();
      };

      voiceRecognition.onerror = event => {
        if (calculatorInputLocked) return;
        const message = voiceErrorMessage(event.error);
        if (['not-allowed', 'service-not-allowed', 'audio-capture'].includes(event.error)) {
          voiceListeningRequested = false;
        }
        setVoiceState('ERROR', message);
        resetVoiceInactivityTimer();
      };

      voiceRecognition.onend = () => {
        voiceRecognitionActive = false;
        voiceRecognitionStartPending = false;
        if (voiceStopRequested) {
          voiceStopRequested = false;
        }
        if (voiceListeningRequested) {
          setVoiceState(calculatorInputLocked ? 'LOCKED' : 'LISTENING');
          if (!calculatorInputLocked) scheduleVoiceRecognitionRestart();
        } else {
          setVoiceState('IDLE');
        }
      };

      voiceButton.addEventListener('click', () => {
        if (voiceListeningRequested) {
          voiceListeningRequested = false;
          releaseVoiceMicrophoneAccess();
          window.clearTimeout(voiceRestartTimer);
          voiceRestartTimer = null;
          voiceStopRequested = true;
          if (voiceRecognitionActive) voiceRecognition.stop();
          else setVoiceState('IDLE');
          return;
        }
        window.clearTimeout(voiceInactivityTimer);
        prepareVoiceSession();
        voiceListeningRequested = true;
        setVoiceState('REQUESTING');
        voiceStopRequested = false;
        ensureVoiceMicrophoneAccess()
          .then(() => {
            if (voiceListeningRequested && !calculatorInputLocked) {
              startVoiceRecognition();
            } else if (!voiceListeningRequested) {
              releaseVoiceMicrophoneAccess();
            }
          })
          .catch(() => {
            if (!voiceListeningRequested) return;
            voiceListeningRequested = false;
            setVoiceState('ERROR', 'マイクの使用を開始できませんでした');
          });
      });
  }

  function isGoogleChrome() {
      const userAgent = navigator.userAgent;
      const isChrome = /Chrome\/|CriOS\//.test(userAgent);
      const isOtherChromiumBrowser = /Edg\/|OPR\/|Opera\/|SamsungBrowser\//.test(userAgent);
      return isChrome && !isOtherChromiumBrowser;
  }

  function setupVoiceInputForBrowser() {
      if (!isGoogleChrome()) {
        voicePanel.hidden = true;
        return;
      }
      initializeVoiceInput();
  }

  function applyTheme(theme) {
    const validTheme = themes.includes(theme) ? theme : 'rainbow';
    currentTheme = validTheme;
    document.body.dataset.theme = validTheme === 'rainbow' ? '' : validTheme;
  }

  function applyRandomTheme(excludeCurrent = false) {
    const candidates = excludeCurrent && themes.length > 1
      ? themes.filter(theme => theme !== currentTheme)
      : themes;
    const nextTheme = candidates[Math.floor(Math.random() * candidates.length)];
    applyTheme(nextTheme);
  }

  keypad.addEventListener('click', event => {
    const button = event.target.closest('.key');
    processButton(button, event);
  });

  document.addEventListener('keydown', event => {
    const keyMap = {
      Enter: '[data-action="equals"]',
      '=': '[data-action="equals"]',
      Escape: '[data-action="clear"]',
      Backspace: '[data-action="backspace"]',
      '.': '[data-action="decimal"]',
      ',': '[data-action="decimal"]',
      '%': '[data-action="percent"]',
      '+': '[data-operator="+"]',
      '-': '[data-operator="-"]',
      '*': '[data-operator="*"]',
      '/': '[data-operator="/"]'
    };

    let selector = keyMap[event.key];
    if (/^[0-9]$/.test(event.key)) selector = `[data-number="${event.key}"]`;
    if (!selector) return;

    event.preventDefault();
    if (calculatorInputLocked) return;
    const button = document.querySelector(selector);
    if (!button) return;

    button.classList.add('pressed');
    processButton(button);
    window.setTimeout(() => button.classList.remove('pressed'), 110);
  });

  calculator.addEventListener('mousemove', event => {
    const rect = calculator.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    calculator.style.transform = `perspective(1100px) rotateX(${y * -3}deg) rotateY(${x * 4}deg)`;
  });

  calculator.addEventListener('mouseleave', () => {
    calculator.style.transform = '';
  });

  window.addEventListener('resize', () => {
    resizeCanvases();
    if (fireworksAnimationId !== null) stopFireworks();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopFireworks();
  });

  applyRandomTheme();
  setupVoiceInputForBrowser();
  resizeCanvases();
  animateParticles();
  updateDisplay();
})();
