import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { useEffect, useState } from "react";


export default function Home() {
  const [AiResult, setAiResult] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [callGoDaddy, setCallGoDaddy] = useState(false);
  const [availableDomains, setAvailableDomains] = useState([]);
  const model = new OpenAI({ openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, temperature: 0.9 });
  const template = "Generate 10 clever domain name ideas for a company that whose main activity is described as {industry}? Returned a numbered list.";
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["industry"],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const chain = new LLMChain({ llm: model, prompt: prompt });
    const res = await chain.call({ industry: input });
    const list = res.text.split('\n').map(item => item.replace(/^\d+\.\s*/, '')).filter(item => item.trim() !== '');
    setAiResult(list);
    setCallGoDaddy(true);
    console.log(list)
  }

  useEffect(() => {
    if (!mounted) return;

    const checkDomainsAreAvailable = async () => {
      const response = await fetch('/api/check-domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(AiResult)
      });
      const data = await response.json();
      return data
    }
   
      console.log('calling internal end point')
      checkDomainsAreAvailable().then(result => {
        console.log(result);
        setCallGoDaddy(false);
        const availableDomains = result.domains.filter(obj => obj.available === true).map(obj => obj.domain);
        setAvailableDomains(availableDomains);
        console.log(`available domains: ${availableDomains}`)
      });
  }, [callGoDaddy])
      


  const handleChange = (e) => {
    setInput(e.target.value);
  }

  const handleClear = () => {
    setInput("");
    setAiResult(null);
  }

  return (
    <div className='w-screen min-h-screen flex justify-center items-center'>
      <div className="flex flex-col justify-center items-center">
        <h1 className='text-3xl w-full text-white text-center '>Domain Name Generator</h1>
        <div className='w-[60vw] p-10 flex flex-col justify-center border rounded-lg shadow-xl mt-10 '>
          <form onSubmit={handleSubmit}
            className="flex flex-col justify-center"
          >
            <label className="text-left">What does the company do?</label>
            <input 
              onChange={handleChange}
              className="my-2 text-gray-800 py-1 px-1" type="text" 
              value={input}
            />
            <button type="submit" className="w-[200px] py-1 px-3 border border-white rounded-md mt-4 hover:bg-white hover:text-black">Submit</button>
            <button onClick={handleClear} className="w-[200px] py-1 px-3 border border-white rounded-md mt-4 hover:bg-white hover:text-black">Clear</button>
          </form>
          <div className="w-full p-4 mt-5">
            <div className="whitespace-pre-wrap">
              <p className="text-xl">Available Domains</p>
              <ol>
                {availableDomains && availableDomains.map((domain, index) => (
                  <li key={index}>
                    {domain}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
