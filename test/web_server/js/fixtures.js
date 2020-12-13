document.addEventListener('DOMContentLoaded', () => {
  const origin = { x: 50, y: 50 }

  window.testFixture = {}

  window.testFixture.addLabel = (input) => {
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

  window.testFixture.resetSvgContents = () => {
    d3.select('#svg-canvas').selectAll("*").remove();
  }

  window.testFixture.getSingleLineLabelDimensions = (input) => {
    const parentContainer = d3.select('#svg-canvas')
    const output = window.labelUtils.getSingleLineLabelDimensions({ parentContainer, ...input })

    const container = parentContainer.append('g')
      .attr('transform', `translate(${origin.x + input.offset.x},${origin.y + input.offset.y})`)

    const textElement = container.append('text')
      .attr('class', `test-label`)
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', 0)
      .attr('dominant-baseline', 'text-before-edge')
      .attr('transform', output.transform)

    textElement.append('tspan')
      .attr('x', 0)
      .attr('y', 0)
      .style('font-size', input.fontSize)
      .style('font-family', input.fontFamily)
      .style('font-weight', input.fontWeight)
      .style('dominant-baseline', 'text-before-edge')
      .text(input.text)

    parentContainer
      .append('rect')
      .attr('class', `test-box`)
      .attr('x', origin.x + input.offset.x)
      .attr('y', origin.y + input.offset.y)
      .attr('width', output.width)
      .attr('height', output.height)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 0.5)

    return output
  }

  window.testFixture.splitIntoLines = (input) => {
    const parentContainer = d3.select('#svg-canvas')
    const output = window.labelUtils.splitIntoLines({ parentContainer, ...input })
    return output
  }
}, false)


