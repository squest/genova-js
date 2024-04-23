import fastifyCors from '@fastify/cors';

function setupHandlers(fastify) {
    fastify.register(fastifyCors);
    // Setup lainnya...
}

export { setupHandlers };
