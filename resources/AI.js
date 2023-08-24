const { Configuration, OpenAIApi } = require("openai");

const OPENAI_API_KEY='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';
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function ask(prompt) {
  // try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        "role": "user", 
        "content": prompt
      }],
    });

    return completion.data.choices[0].message.content;
  // } catch {
  //   return "Request Limit exceeded. Please wait";  
  // }
}

module.exports = {
  ask
};