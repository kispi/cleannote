export const tooltip = $state({
  visible: false,
  content: '',
  x: 0,
  y: 0,
  
  show(content: string, x: number, y: number) {
    this.visible = true
    this.content = content
    this.x = x
    this.y = y
  },
  
  hide() {
    this.visible = false
  },
  
  move(x: number, y: number) {
    this.x = x
    this.y = y
  }
})
