import Fastify from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import Handlebars from 'handlebars';

import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config, readLinkConfig } from './config.js';

const links = await readLinkConfig();

const __filename = fileURLToPath(import.meta.url);
const __dirname = import.meta.dirname;

const fastify = Fastify({ logger: true });

// Register the view plugin with Handlebars
fastify.register(fastifyView, {
  engine: { handlebars: Handlebars },
  root: join(__dirname, '..', 'views'),
});

// Register static file serving (CSS, JS, images)
fastify.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    prefix: '/',
});

// Define a route
fastify.get('/', (req, reply) => {
  reply.view('index.hbs', { 
    title: config.title, 
    headerTitle: config.title,
    links,
  });
});

// Start the server
fastify.listen({ port: config.port, host: '0.0.0.0' }, (err) => {
  if (err) throw err;
  console.log(`Server running on port ${config.port}`);
});