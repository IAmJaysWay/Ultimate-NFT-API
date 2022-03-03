import { Card, Typography, Button, Image, Tag } from "antd";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { obsidian, defaultStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useState } from "react";
import { useMoralis } from "react-moralis";

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

const avax2 = 'await Moralis.Web3API.token.getAllTokenIds(options)'

export default function QuickStart({ isServerInfo }) {
  const { Moralis } = useMoralis();
  const [hi, setHi] =useState();
  const [images, setImages] = useState();
  const [avaxC, setAvaxC] = useState(false);
  const [ethC, setEthC] = useState(true);
  const [maticC, setMaticC] = useState(false);
  const [avax1, setAvax1] = useState('const options = {chain: "eth", address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", limit: 10}');


  const resolveLink = (url) => {
    if (!url || !url.includes("ipfs://")) return url;
    return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
  };

  async function getNFTss(){
    let options;
    if(avaxC){
      options = {chain: "avalanche", address: "0x2cca3a1a45c1b1036d7194cd15a981b8c2f9dee4", limit: 2, offset: 700};
    }else if(ethC){ 
      options = {chain: "eth", address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", limit: 10};
    }else{
      options = {chain: "polygon", address: "0xdC0479CC5BbA033B3e7De9F178607150B3AbCe1f", limit: 4, offset: 7570};
    }
    const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);

    setHi(JSON.stringify(NFTs, null, 2));
    
    for (let NFT of NFTs.result) {
        if (NFT?.metadata) {
          NFT.metadata = JSON.parse(NFT.metadata);
          NFT.image = resolveLink(NFT.metadata?.image);
        }
    }
    
    setImages(NFTs.result);

  };


  function checkAvax(){
    setAvaxC(true);
    setEthC(false);
    setMaticC(false);
    setAvax1('const options = {chain: "avalanche", address: "0x2cca3a1a45c1b1036d7194cd15a981b8c2f9dee4", limit: 2}');
  }

  function checkEth(){
    setEthC(true);
    setMaticC(false);
    setAvaxC(false);
    setAvax1('const options = {chain: "eth", address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", limit: 10}');
  }

  function checkMatic(){
    setMaticC(true);
    setEthC(false);
    setAvaxC(false);
    setAvax1('const options = {chain: "polygon", address: "0xdC0479CC5BbA033B3e7De9F178607150B3AbCe1f", limit: 4}');
  }

  return (
    <div style={{display:"flex", flexDirection:"column", gap:"20px"}} >
      <Title style={{textAlign:"center"}}> getAllTokenIds()</Title>
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
          {
          images?.map((nft) => (
                  <Image
                    preview={false}
                    src={nft?.image || "error"}
                    alt=""
                    style={{ height: "240px" }}
                  />
            ))
          }
        </Card>
      </div>
    </div>
}
    </div>
  );
}
