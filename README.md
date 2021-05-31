# infovis-first-project
First project for Information Visualization course at Roma Tre University. Simple implementation involving D3.js

## Requirements
- Create a JSON file with multivariate data:
  - there are 10 data-case and each of them has five quantitative variables (all positive values).

- Draw a plot for this dataset using a "stacked bars" plot:
  - each bar is dedicated to a data-case and is made by stacking the five bars relative to the five variables of the data-point.

- Clicking with the left mouse on a section of a bar:
  - All the bars move down in a way that the base of the clicked section aligns with the x axis.

- All the transitions must be smooth, and use D3.js scales to map the variable domain (which is arbitrary) to the stacked bars diagram height range.

## Usage
Run `./run_http_server.sh` to start an HTTP server on `localhost:8888`

## Live Demo
https://ale-pavel.github.io/infovis-first-project/

## Data Source
https://ourworldindata.org/grapher/per-capita-electricity-source-stacked?time=2020&country=JPN~DEU~GBR~FRA~ITA~GRC~ESP~USA~CHN~RUS
