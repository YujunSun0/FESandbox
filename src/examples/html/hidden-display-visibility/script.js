const buttons = document.querySelectorAll('button[data-target]')

const toggles = {
  display: () => document.getElementById('display')?.classList.toggle('is-hidden'),
  visibility: () => document.querySelector('#visibility .box')?.classList.toggle('is-hidden'),
  hidden: () => document.getElementById('hidden')?.classList.toggle('is-hidden'),
}

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-target')
    const fn = toggles[key]
    fn?.()
  })
})
