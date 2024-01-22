const threshold = 0.8; // our minimum threshold

const input = document.getElementById('text');
const button = document.getElementById('classify');
const output = document.getElementById('output');

// Create the classify function
const classify = async (model, text) => {
  const sentences = [text]; // The model takes list as input
  output.innerHTML = 'Classifying...';
  // I used model.predict instead of model.classify
  let predictions = await model.classify(sentences);
  predictions = predictions.map((prediction) => ({
    label: prediction['label'],
    match: prediction.results[0]['match'],
  })); // Label is like "identity_threat", "toxicity"
  // match is whether the text matches the label
  return predictions.filter((p) => p.match).map((p) => p.label); // This gives us a list like ["identity_threat", "toxocity"]
};

const main = async () => {
  const model = await toxicity.load(threshold);
  button.onclick = async () => {
    const text = input.value;
    const predictions = await classify(model, text);
    if (predictions.length == 0) {
      output.innerHTML = 'Probably not toxic.';
    } else {
      output.innerHTML = predictions;
    }
  };
};

main(); // Our main function, loads the model and creates the event handler
