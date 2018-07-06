module.exports = function(env) {
    process.env = env;
    return require(`./webpack/${env.build}.js`)
};