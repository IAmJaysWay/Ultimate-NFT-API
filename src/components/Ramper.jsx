import { Card, Typography, Button, Image, Table, Tag, Space } from "antd";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { obsidian, defaultStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useState } from "react";
import { useMoralis } from "react-moralis";
import { getEllipsisTxt } from "helpers/formatters";
import eth  from "eth.png"

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
  const [data, setData] = useState();
  const [maticC, setMaticC] = useState(false);
  const [avax1, setAvax1] = useState('const options = {chain: "eth", address: "0xd8539b7bc41374ab4897256fa9a0a39c670730f0"}');



  const columns = [
    {
      title: 'Transfer',
      key: 'from_address',
      dataIndex: 'from_address',
      render: from_address => (
        <> 
              {from_address === "0xd8539b7bc41374ab4897256fa9a0a39c670730f0" ?
              <Tag color={'volcano'} key={from_address}>
                OUT
              </Tag> :
              <Tag color={'green'} key={from_address}>
                IN
              </Tag> 
            }
    
              
            
          
        </>
      ),
    },
    {
      title: 'Item',
      key: 'item',
      render: (text, record) => (
        <Space size="middle">
          <img src={record.image} style={{width:"42px", borderRadius:"10px"}}></img>
          <span>#{record.id}</span>
        </Space>
      ),
    },
    {
      title: 'Collection',
      dataIndex: 'name',
      key: 'name',
    },
    {
    title: 'From',
    key: 'from',
    render: (text, record) => (
      getEllipsisTxt(record.from_address, 5)
    ),
    },
    {
      title: 'To',
      key: 'to',
      render: (text, record) => (
        getEllipsisTxt(record.to_address, 5)
      ),
      },
      {
        title: 'Value',
        key: 'value',
        render: (text, record) => (
          <>
          <div style={{display:"flex"}}>
          <img src={eth} style={{width:"16px", marginRight:"5px"}}></img>
         <span>{record.value / 1000000000000000000}</span> 
         </div>
        </>),
        },
    /* {
      title: 'Item',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Collection',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'From',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
     */
  ];
  




  async function getNFTss(){
    let options;
    if(avaxC){
      options = {chain: "avalanche", address: "0x2cca3a1a45c1b1036d7194cd15a981b8c2f9dee4"};
    }else if(ethC){
      options = {chain: "eth", address: "0xd8539b7bc41374ab4897256fa9a0a39c670730f0"};
    }else{
      options = {chain: "polygon", address: "0xdC0479CC5BbA033B3e7De9F178607150B3AbCe1f"};
    }

    const NFTs = await Moralis.Web3API.account.getNFTTransfers(options);

    setHi(JSON.stringify(NFTs, null, 2));
    
    for (let NFT of NFTs.result) {
      const ops = { address: NFT.token_address, token_id: NFT.token_id, chain: "eth" };
      const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(ops);
      console.log(tokenIdMetadata)
      if (tokenIdMetadata?.metadata) {
        tokenIdMetadata.metadata = JSON.parse(tokenIdMetadata.metadata);
        NFT.image = resolveLink(tokenIdMetadata.metadata?.image);
        NFT.name = tokenIdMetadata.name;
        NFT.id = tokenIdMetadata.token_id;
      }
  }

  console.log(NFTs);
  setData(NFTs.result);

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
      <Title style={{textAlign:"center"}}> getNFTTransfers()</Title>
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
      {vis && 
      <Table columns={columns} dataSource={data} />
}
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
