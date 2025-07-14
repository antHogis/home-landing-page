# home-landing-page

A landing page services for displaying a configurable set of links.
Designed for displaying links to smart home services, but can be used
for whatever

## Run locally

    nvm use
    npm install
    npm start

Then view at [http://localhost:3130](http://localhost:3130)

## Configuration

### Env variables

#### HLP_LINK_CONFIG_PATH
Env example: `HLP_LINK_CONFIG_PATH=/path/to/my/config.json`.
Configures the links with a json file.
See [sample link configuration](./examples/links.json).

#### HLP_TITLE
Env example: `HLP_LINK_CONFIG_PATH="My Landing Page"`.
Sets the title for the landing page site.

### Link images
The images for the links must be linked to `public/link-images`. The npm start script does this automatically.

### Docker compose example

TODO

