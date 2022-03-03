import { Card, Typography, Button, Image, Table, Tag, Space } from "antd";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { obsidian, defaultStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useState } from "react";
import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import { Line } from '@ant-design/charts';

const { Text, Title } = Typography;
const { CheckableTag } = Tag;

const styles = {
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "0.5rem",
  },
  small:{
    width:"300px"
  },
  top:{
    width:"1360px"
  }

}

const avax2 = 'await Moralis.Web3API.account.getNFTTransfers(options);'

const resolveLink = (url) => {
  if (!url || !url.includes("ipfs://")) return url;
  return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
};

export default function Wallet({ isServerInfo }) {
  const { Moralis } = useMoralis();
  const [hi, setHi] =useState();
  const [vis, setVis] = useState();
  const [avaxC, setAvaxC] = useState(false);
  const [ethC, setEthC] = useState(true);
  //const [data, setData] = useState();
  const [maticC, setMaticC] = useState(false);
  const [avax1, setAvax1] = useState('const options = {chain: "eth", address: "0xd8539b7bc41374ab4897256fa9a0a39c670730f0"}');



  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];

  const config = {
    data,
    width: 1000,
    height: 200,
    autoFit: false,
    xField: 'year',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  let chart;




  async function getNFTss(){
    let options;
    if(avaxC){
      options = {chain: "avalanche", address: "0x2cca3a1a45c1b1036d7194cd15a981b8c2f9dee4"};
    }else if(ethC){
      options = { address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", days: "3" };
    }else{
      options = {chain: "polygon", address: "0xdC0479CC5BbA033B3e7De9F178607150B3AbCe1f"};
    }

    
    const NFTLowestPrice = await Moralis.Web3API.token.getNFTLowestPrice(options);
    console.log(NFTLowestPrice)
    setHi(JSON.stringify(NFTLowestPrice, null, 2));
    
  

  };


  function checkAvax(){
    setAvaxC(true);
    setEthC(false);
    setMaticC(false);
    setAvax1('const options = {chain: "avalanche", address: "0x2cca3a1a45c1b1036d7194cd15a981b8c2f9dee4"}');
  }

  function checkEth(){
    setEthC(true);
    setAvaxC(false);
    setMaticC(false);
    setAvax1('const options = {chain: "eth", address: "0x1A92f7381B9F03921564a437210bB9396471050C"}');
  }

  function checkMatic(){
    setMaticC(true);
    setEthC(false);
    setAvaxC(false);
    setAvax1('const options = {chain: "polygon", address: "0xdC0479CC5BbA033B3e7De9F178607150B3AbCe1f"}');
  }

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"20px"}} >
      <Title style={{textAlign:"center"}}> getNFTLowestPrice()</Title>
      <Card
        style={styles.card, styles.top}
      >
        <div style={{ display: "flex", gap: "10px" }}>
        <div style={{padding:"10px", backgroundColor:"rgb(240, 240, 240)", borderRadius:"8px", width:"1000px"}}>
        <SyntaxHighlighter language="javascript" style={defaultStyle} wrapLongLines={true}>
          {avax1}
        </SyntaxHighlighter>
        <SyntaxHighlighter language="javascript" style={defaultStyle} wrapLongLines={true}>
          {avax2}
        </SyntaxHighlighter>
        </div>
        <div>
        <div style={{marginBottom:"20px", marginTop:"20px",marginLeft:"70px"}}>
        <CheckableTag
            checked= {ethC}
            onChange={() => checkEth()}
          >
            ETH
          </CheckableTag>
        <CheckableTag
            checked= {avaxC}
            onChange={() => checkAvax()}
          >
            AVAX
          </CheckableTag>
          <CheckableTag
            checked= {maticC}
            onChange={() => checkMatic()}
          >
            MATIC
          </CheckableTag>
          </div>
          <Button onClick={()=>getNFTss()} style={{marginLeft:"120px"}}>Run</Button>
          </div>
        </div>
      </Card>
      <Card style={{paddingLeft:"150px"}}>
      <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
      </Card>
      {hi &&
    <div style={{ display: "flex", gap: "10px" }}>
      
      <Card
        style={styles.card}
        title={
          <>
            📝 <Text strong>JSON Response</Text>
          </>
        }
      >
        
        <div style={{padding:"10px", backgroundColor:"rgb(40, 43, 46)", borderRadius:"8px", width:"1000px"}}>
        <SyntaxHighlighter language="json" style={obsidian} wrapLongLines={true}>
          {hi}
        </SyntaxHighlighter>
        </div>
        
      </Card>
      <div>
       
        <Card
          style={styles.card, styles.small}
          title={
            <>
              🎨 <Text strong> Processed Results</Text>
            </>}
            
        >
          <Button onClick={()=>setVis(!vis)}> Show Table</Button>
        </Card>
      </div>
    </div>
}
    </div>
  );
}
