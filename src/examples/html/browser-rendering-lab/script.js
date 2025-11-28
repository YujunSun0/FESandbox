const styleLog = document.getElementById('styleLog')
const cssBox = document.getElementById('css-box')
const layoutLog = document.getElementById('layoutLog')

// CSSOM & 렌더 트리 확인
document.getElementById('styleBtn').onclick = () => {
  const computed = getComputedStyle(cssBox)
  styleLog.textContent = `Computed Style\nwidth: ${computed.width}\nheight: ${computed.height}\nbackground: ${computed.backgroundColor}`
  console.log('Computed Style:', computed)
}

// 파싱 중단 실험 (시뮬레이션)
document.getElementById('blockBtn').onclick = () => {
  const result = document.getElementById('blockingResult')
  console.log('스크립트 실행 → HTML 파싱 중단')
  const start = performance.now()
  while (performance.now() - start < 1000) {
    // 1초 블로킹
  }
  console.log('스크립트 실행 완료 → HTML 파싱 재개')
  result.textContent = '1초 블로킹 완료! 콘솔 로그 순서를 확인해 보세요.'
}

// Reflow vs Repaint
document.getElementById('reflowBtn').onclick = () => {
  const box = document.getElementById('reflowBox')
  console.time('reflow')
  box.style.width = box.offsetWidth + 10 + 'px' // 레이아웃 변경 → reflow
  box.style.marginTop = '20px'
  console.timeEnd('reflow')
  document.getElementById('reflowLog').textContent = 'Reflow 발생: width/offsetWidth 읽기 + width 변경'
}

document.getElementById('repaintBtn').onclick = () => {
  const box = document.getElementById('repaintBox')
  console.time('repaint')
  box.style.background = box.style.background === 'pink' ? 'skyblue' : 'pink' // 색상만 변경 → repaint
  console.timeEnd('repaint')
  document.getElementById('repaintLog').textContent = 'Repaint만 발생: 색상 변경'
}

// Flex/Grid 전환 실험
const container = document.getElementById('container')
document.getElementById('flexBtn').onclick = () => {
  container.style.display = 'flex'
  container.style.gap = '8px'
  container.style.gridTemplateColumns = ''
  layoutLog.textContent = 'display: flex → 가로로 나열'
}
document.getElementById('gridBtn').onclick = () => {
  container.style.display = 'grid'
  container.style.gridTemplateColumns = 'repeat(3, 1fr)'
  container.style.gap = '8px'
  layoutLog.textContent = 'display: grid → 3열 그리드'
}

// 초기 로그
console.log('DOM 생성 완료:', document.readyState)
