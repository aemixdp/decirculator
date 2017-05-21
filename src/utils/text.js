export default {
    snakeToCamel: (string) =>
        string.replace(/(-.)/g, (m) => m[1].toUpperCase()),
}