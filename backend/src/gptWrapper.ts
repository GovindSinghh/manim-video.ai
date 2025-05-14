require('dotenv').config();
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { getSystemPrompt } from "./sytemPrompt";
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
}
const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
);

export async function generateScript(userPrompt:string) {

    try{
            const response = await client.path("/chat/completions").post({
                body: {
                messages: [
                    { role:"system", content: getSystemPrompt() },
                    { role:"user", content:userPrompt }
                ],
                temperature: 0.0,
                top_p: 1.0,
                model: model
                }
            });
            if (isUnexpected(response)) {
                throw response.body.error;
            }

            return response.body.choices[0].message.content;
    }
    catch(error){
        throw new Error("Error while Script Generation. Try again!");
    }
}