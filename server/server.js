import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
    apiKey: (process.env.OPENAI_API_KEY)
})

const openai = new OpenAIApi(configuration)

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Hello from CodeX"
    })
})

app.post('/', async (req,res) => {
    try {
        const prompt = req.body.prompt
        console.log("Recieved request")
        console.log(req.body)
        
        try {
            const response = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: `${prompt}`,
                temperature: 0,
                max_tokens: 1000,
                top_p: 1,
                frequency_penalty: 0.5,
                presence_penalty: 0,
            })
            res.status(200).send({
                bot: response.data.choices[0].text
            })
            console.log(response)
        } catch (err) {
            console.error("Error contacting OPENAI services")
            res.status(500).send({"error":"Error contacting with OpenAi services"})
        }


    } catch(error) {
        console.error(error)
        res.status(500).send({error})
    }
})

app.listen(5000, () => {
    console.log('Server is up and healthy on port 5000')
})