import { Card, Typography, Button, Image, Tag } from "antd";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { obsidian, defaultStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useState } from "react";
import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";

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

const avax2 = 'await Moralis.Web3API.token.getNFTOwners(options);'

const resolveLink = (url) => {
  if (!url || !url.includes("ipfs://")) return url;
  return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
};

export default function Wallet({ isServerInfo }) {
  const { Moralis } = useMoralis();
  const [hi, setHi] =useState();
  const [owners, setOwners] = useState();
  const [avaxC, setAvaxC] = useState(false);
  const [ethC, setEthC] = useState(true);
  const [maticC, setMaticC] = useState(false);
  const [avax1, setAvax1] = useState('const options = {chain: "eth", address: "0x1A92f7381B9F03921564a437210bB9396471050C"}');



  async function getNFTss(){
    let options;
    if(avaxC){
      options = {chain: "avalanche", address: "0x2cca3a1a45c1b1036d7194cd15a981b8c2f9dee4", limit:500};
    }else if(ethC){
      options = {chain: "eth", address: "0x1A92f7381B9F03921564a437210bB9396471050C", limit:500};
    }else{
      options = {chain: "polygon", address: "0xdC0479CC5BbA033B3e7De9F178607150B3AbCe1f", limit:500};
    }

    const NFTs = await Moralis.Web3API.token.getNFTOwners(options);

    setHi(JSON.stringify(NFTs, null, 2));
    setOwners(NFTs.result);
    console.log(owners);
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
      <Title style={{textAlign:"center"}}> getNFTOwners()</Title>
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

          


          {owners &&
          <>
          <div style={{textAlign: "center" }}>
          <Title level={3}>
            Owners Of
          </Title> 
          <Title level={4}>
            {owners[0].name}
          </Title> 
          <img src={resolveLink(JSON.parse(owners[0].metadata).image)} alt="" style={{width:"50px", borderRadius:"50%",  marginBottom:"20px",marginLeft: "auto", marginRight: "auto"}}></img>
          </div>
          {
          owners?.map((nft) => (
                  <p style={{fontSize:"20px"}}>{getEllipsisTxt(nft.owner_of, 6)}</p>
            ))
          }
          </>
          }
        </Card>
      </div>
    </div>
}
    </div>
  );
}
