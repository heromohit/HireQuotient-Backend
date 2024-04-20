import './App.css';
import React,{useEffect, useState} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

function App() {
  const [holdings,setHoldings]=useState([]);
  useEffect(()=>{
    getHoldings();
  },[]);
  const [expandedGroup, setExpandedGroup] = useState(null);

  const handleGroupClick = (group) => {
    setExpandedGroup(group === expandedGroup ? null : group);
  };

  const getHoldings=async ()=>{
    let result=await fetch('https://canopy-frontend-task.now.sh/api/holdings');
    result =await result.json();
    const groupings = result.payload.reduce((acc, obj) => {
      const asset_class = obj.asset_class;
      if (!acc[asset_class]) {
        acc[asset_class] = [];
      }
      acc[asset_class].push(obj);
      return acc;
    }, {});

    setHoldings(groupings);
  }

  return (
    <div className="App">
      {Object.entries(holdings).map(([group, items]) => (
        <TableContainer component={Paper} key={group}>
          <Table>
            <TableHead>
              <TableRow onClick={() => handleGroupClick(group)}>
                <TableCell>
                  <IconButton aria-label="expand row" size="small">
                    {expandedGroup === group ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                  {group} ({items.length})
                </TableCell>
              </TableRow>
            </TableHead>
            <Collapse in={expandedGroup === group} timeout="auto" unmountOnExit>
              <TableHead>
                <TableRow>
                  <TableCell>Name of the Holding</TableCell>
                  <TableCell>Ticker</TableCell>
                  {group !== 'Cash' && <TableCell>Average Price</TableCell>}
                  {group !== 'Cash' && <TableCell>Market Price</TableCell>}
                  <TableCell>Latest Change Percentage</TableCell>
                  <TableCell>Market Value in Base CCY</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.ticker}</TableCell>
                    {group !== 'Cash' && <TableCell>{item.avg_price}</TableCell>}
                    {group !== 'Cash' && <TableCell>{item.market_price}</TableCell>}
                    <TableCell>{item.latest_chg_pct}</TableCell>
                    <TableCell>{item.market_value_ccy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Collapse>
          </Table>
        </TableContainer>
      ))}
    </div>
  );
}

export default App;
