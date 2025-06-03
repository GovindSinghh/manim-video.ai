import 'dotenv/config';
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
interface API_RESPONSE {
    script:string;
    sceneName:string
}

export async function generateScript(userPrompt:string):Promise<API_RESPONSE> {
    
    try{
        const response = await client.path("/chat/completions").post({
            body: {
                messages: [
                    { role:"system", content: getSystemPrompt() },
                    { role:"user", content:userPrompt }
                ],
                temperature: 0.0,
                top_p: 1.0,
                model: model,
                response_format: { type: "json_object" }
            }
        });
        
        if (isUnexpected(response)) {
            console.error("Unexpected response:", response.body.error);
            throw response.body.error;
        }

        const content = response.body.choices[0].message.content;
        if (!content) {
            throw new Error("Empty response from API");
        }
        
        const parsedContent = JSON.parse(content);
        return {
            script: parsedContent.script,
            sceneName: parsedContent.sceneName
        };
    }
    catch(error: any){
        console.error("Script generation error:", error);
        throw new Error(`Error while Script Generation: ${error?.message || 'Unknown error'}`);
    }
}