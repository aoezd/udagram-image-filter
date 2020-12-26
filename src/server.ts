import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  /**
   * Validates a given image via an URL, filters the image and sends the resulting file as a response
   */
  app.get('/filteredimage', async (req, res) => {
    let { image_url } = req.query;

    if (!image_url) {
      return res
        .status(400)
        .send({ message: 'image_url is required or malformed' });
    }

    await filterImageFromURL(image_url)
      .then((filterImage) => {
        res
          .status(200)
          .sendFile(filterImage, {}, () => deleteLocalFiles([filterImage]));
      })
      .catch((error) =>
        res.status(422).send({
          message: `Given image could not be processed: ${error}`,
        })
      );
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get('/', async (req, res) => {
    res.send('try GET /filteredimage?image_url={{}}');
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
