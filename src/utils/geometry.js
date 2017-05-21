export default {
    shapes: {
        center: (shape, offset = { x: 0, y: 0 }) => ({
            x: offset.x + shape.x + shape.width / 2,
            y: offset.y + shape.y + shape.height / 2,
        }),
    },
}