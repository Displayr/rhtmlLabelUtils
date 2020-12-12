document.addEventListener('DOMContentLoaded', () => {
  const origin = { x: 50, y: 50 }

  window.callAddLabel = (input) => {
    const parentContainer = d3.select('#svg-canvas')
    const container = parentContainer.append('g')
    .attr('transform', `translate(${origin.x + input.offset.x},${origin.y + input.offset.y})`)
    const output = window.labelUtils.addLabel({ parentContainer: container, ...input })

    container
    .append('rect')
    .attr('class', `test-box`)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', input.bounds.width)
    .attr('height', input.bounds.height)
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 0.5)

    return output
  }
}, false)


