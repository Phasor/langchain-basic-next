import { OpenAI } from "langchain/llms/openai";
import { useState } from "react";


export default function Home() {
  const [result, setResult] = useState(null);
  const [input, setInput] = useState("");
  const model = new OpenAI({ openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, temperature: 0.9 });

  // const res = await model.call(
  //   "What would be a good company name a company that makes colorful socks?"
  // );
  // console.log(res);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await model.call(input);
    setResult(res);
    console.log(res);
  }

  const handleChange = (e) => {
    setInput(e.target.value);
  }

  const handleClear = () => {
    setInput("");
    setResult(null);
  }

  return (
    <div className='w-screen min-h-screen flex justify-center items-center'>
      <div className="flex flex-col justify-center items-center">
        <h1 className='text-3xl w-full text-white text-center '>Example OpenAI API Test</h1>
        <div className='w-[60vw] p-10 flex flex-col justify-center border rounded-lg shadow-xl mt-10 '>
          <form onSubmit={handleSubmit}
            className="flex flex-col justify-center"
          >
            <label className="text-left">Input</label>
            <input 
              onChange={handleChange}
              className="my-2 text-gray-800 py-1 px-1" type="text" 
              value={input}
            />
            <button type="submit" className="w-[200px] py-1 px-3 border border-white rounded-md mt-4 hover:bg-white hover:text-black">Submit</button>
            <button onClick={handleClear} className="w-[200px] py-1 px-3 border border-white rounded-md mt-4 hover:bg-white hover:text-black">Clear</button>
          </form>
          <div className="w-full p-4 mt-5">
            <p className="whitespace-pre-wrap">
              {result && result}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
