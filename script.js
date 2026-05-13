// reveal 动画

const reveals = document.querySelectorAll('.reveal')
const cards = document.querySelectorAll('.reveal-card')

const observer = new IntersectionObserver((entries)=>{

  entries.forEach(entry=>{

    if(entry.isIntersecting){

      entry.target.classList.add('active')

    }

  })

},{
  threshold:0.15
})

reveals.forEach(el=>{
  observer.observe(el)
})

cards.forEach(el=>{
  observer.observe(el)
})


// 鼠标视差

document.addEventListener('mousemove',(e)=>{

  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight

  const ball1 = document.querySelector('.ball-1')
  const ball2 = document.querySelector('.ball-2')

  ball1.style.transform =
    `translate(${x * 40}px, ${y * 40}px)`

  ball2.style.transform =
    `translate(${x * -40}px, ${y * -40}px)`

})


// navbar 背景变化

window.addEventListener('scroll',()=>{

  const header = document.querySelector('.header')

  if(window.scrollY > 50){

    header.style.background = 'rgba(0,0,0,.65)'

  }else{

    header.style.background = 'rgba(0,0,0,.25)'

  }

})