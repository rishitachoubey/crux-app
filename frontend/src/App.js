import React, { useState } from 'react';
import {
  Box, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Typography, IconButton
} from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function App() {
  const [url, setUrl] = useState('');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [fcpFilter, setFcpFilter] = useState('');
  const [lcpFilter, setLcpFilter] = useState('');
  const [clsFilter, setClsFilter] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSearch = async () => {
    setError('');
    setRows([]);
    try {
      // Split URLs by line, trim, and filter out empty lines
      const urlList = url.split('\n').map(u => u.trim()).filter(Boolean);
      const res = await axios.post('/api/search', { urls: urlList });
      // Expecting res.data to be an array of results
      const newRows = res.data.map(result => {
        const metrics = result.metrics || {};
        return {
          url: result.url,
          data1: metrics['first_contentful_paint']?.percentiles?.p75 ?? 'N/A',
          data2: metrics['largest_contentful_paint']?.percentiles?.p75 ?? 'N/A',
          data3: metrics['cumulative_layout_shift']?.percentiles?.p75 ?? 'N/A',
          error: result.error
        };
      });
      setRows(newRows);
      setSortBy('data1');
      setSortOrder('asc');
      // Only set global error if all rows have error
      if (newRows.length > 0 && newRows.every(row => row.error)) {
        setError('No data found or error fetching data.');
      }
    } catch (err) {
      setError('No data found or error fetching data.');
    }
  };

  // Filter rows based on thresholds
  const filteredRows = rows.filter(row => {
    const fcp = Number(row.data1);
    const lcp = Number(row.data2);
    const cls = Number(row.data3);
    return (
      (fcpFilter === '' || (fcp && fcp >= Number(fcpFilter))) &&
      (lcpFilter === '' || (lcp && lcp >= Number(lcpFilter))) &&
      (clsFilter === '' || (cls && cls >= Number(clsFilter)))
    );
  });

  // Sorting logic
  const sortedRows = [...filteredRows];
  if (sortBy) {
    sortedRows.sort((a, b) => {
      const aVal = Number(a[sortBy]);
      const bVal = Number(b[sortBy]);
      if (isNaN(aVal) || isNaN(bVal)) return 0;
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }
  // Only show as many rows as there are URLs (plus summary)
  const displayRows = sortedRows;

  // Sort handler
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Calculate summary (average) for FCP, LCP, CLS
  const validRows = rows.filter(row => !isNaN(Number(row.data1)) && !isNaN(Number(row.data2)) && !isNaN(Number(row.data3)));
  const avg = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : 'N/A';
  const avgFCP = avg(validRows.map(row => Number(row.data1)));
  const avgLCP = avg(validRows.map(row => Number(row.data2)));
  const avgCLS = avg(validRows.map(row => Number(row.data3)));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ccc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 6,
      }}
    >
      {/* Improved URL input and Search UI for multiple URLs */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Box sx={{ width: 500, mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 1 }}>URLs</Typography>
        <TextField
          variant="outlined"
          value={url}
          onChange={e => setUrl(e.target.value)}
          sx={{
              width: '100%',
            background: '#fff',
              borderRadius: 2,
              textarea: { fontSize: 18, textAlign: 'left', minHeight: 90 }
          }}
            inputProps={{ style: { fontSize: 18, textAlign: 'left' } }}
            multiline
            minRows={3}
            maxRows={8}
            placeholder={"Enter one or more URLs, each on a new line"}
            helperText="Enter one URL per line."
        />
        </Box>
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            width: 200,
            height: 56,
            fontWeight: 700,
            fontSize: 20,
            borderRadius: 3,
            background: '#1976d2',
            color: '#fff',
            mb: 3,
            boxShadow: 2,
            '&:hover': {
              background: '#1565c0',
            },
          }}
        >
          SEARCH
        </Button>
      </Box>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {/* Improved Filter Controls */}
      <Paper elevation={2} sx={{ p: 2, mb: 2, display: 'inline-block', background: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          Filter Results
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="FCP ≥ (ms)"
            type="number"
            value={fcpFilter}
            onChange={e => setFcpFilter(e.target.value)}
            size="small"
            sx={{ width: 140 }}
          />
          <TextField
            label="LCP ≥ (ms)"
            type="number"
            value={lcpFilter}
            onChange={e => setLcpFilter(e.target.value)}
            size="small"
            sx={{ width: 140 }}
          />
          <TextField
            label="CLS ≥ (score)"
            type="number"
            value={clsFilter}
            onChange={e => setClsFilter(e.target.value)}
            size="small"
            sx={{ width: 140 }}
          />
        </Box>
      </Paper>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: 800,
          minWidth: 800,
          borderRadius: 0,
          boxShadow: 0,
          mt: 4,
        }}
      >
        <Table sx={{ minWidth: 800, border: '2px solid #222' }} aria-label="crux data table">
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={rows.length > 1 ? 4 : 3}
                align="center"
                sx={{
                  fontSize: 24,
                  fontWeight: 700,
                  border: '2px solid #222',
                  background: '#fff',
                  height: 40,
                }}
              >
                CRUX Data
              </TableCell>
            </TableRow>
            <TableRow>
              {rows.length > 1 && (
                <TableCell
                  align="center"
                  sx={{ fontSize: 20, fontWeight: 600, border: '2px solid #222', height: 60, background: '#f5f5f5', padding: '8px' }}
                >
                  URL
                </TableCell>
              )}
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: 600, border: '2px solid #222', height: 60, background: '#f5f5f5', cursor: 'pointer', padding: '8px' }}
                onClick={() => handleSort('data1')}
              >
                FCP (ms)
                {sortBy === 'data1' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: 600, border: '2px solid #222', background: '#f5f5f5', cursor: 'pointer', padding: '8px' }}
                onClick={() => handleSort('data2')}
              >
                LCP (ms)
                {sortBy === 'data2' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontSize: 20, fontWeight: 600, border: '2px solid #222', background: '#f5f5f5', cursor: 'pointer', padding: '8px' }}
                onClick={() => handleSort('data3')}
              >
                CLS (score)
                {sortBy === 'data3' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows.map((row, idx) => (
              <TableRow key={idx}>
                {rows.length > 1 && (
                  <TableCell align="center" sx={{ height: 60, border: '2px solid #222', fontSize: 16, wordBreak: 'break-all', padding: '8px' }}>
                    {row.url || ''}
                  </TableCell>
                )}
                {row.error ? (
                  <TableCell align="center" colSpan={rows.length > 1 ? 3 : 3} sx={{ color: 'red', fontWeight: 600, fontSize: 16, border: '2px solid #222', padding: '8px' }}>
                    {typeof row.error === 'string' ? row.error : (row.error?.error?.message || 'Error fetching data')}
                  </TableCell>
                ) : (
                  <>
                    <TableCell align="center" sx={{ height: 60, border: '2px solid #222', fontSize: 18, padding: '8px' }}>
                  {row.data1}
                    </TableCell>
                    <TableCell align="center" sx={{ height: 60, border: '2px solid #222', fontSize: 18, padding: '8px' }}>
                      {row.data2}
                    </TableCell>
                    <TableCell align="center" sx={{ height: 60, border: '2px solid #222', fontSize: 18, padding: '8px' }}>
                      {row.data3}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
            {/* Summary row for multiple URLs */}
            {rows.length > 1 && (
              <TableRow>
                <TableCell align="center" sx={{ height: 60, border: '2px solid #222', fontWeight: 700, background: '#e0e0e0', fontSize: 18, padding: '8px' }}>
                  AVERAGE
                </TableCell>
                <TableCell align="center" sx={{ height: 60, border: '2px solid #222', fontWeight: 700, background: '#e0e0e0', fontSize: 18, padding: '8px' }}>
                  {avgFCP}
                </TableCell>
                <TableCell align="center" sx={{ height: 60, border: '2px solid #222', fontWeight: 700, background: '#e0e0e0', fontSize: 18, padding: '8px' }}>
                  {avgLCP}
                </TableCell>
                <TableCell align="center" sx={{ height: 60, border: '2px solid #222', fontWeight: 700, background: '#e0e0e0', fontSize: 18, padding: '8px' }}>
                  {avgCLS}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Insights & Recommendations */}
      {rows.length > 0 && (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Insights & Recommendations
          </Typography>
          {rows.map((row, idx) => {
            if (row.error) return null;
            const fcp = Number(row.data1);
            const lcp = Number(row.data2);
            const cls = Number(row.data3);

            const getStatus = (value, good, needsImprovement) => {
              if (value <= good) return { status: 'Good', color: 'green' };
              if (value <= needsImprovement) return { status: 'Needs Improvement', color: 'orange' };
              return { status: 'Poor', color: 'red' };
            };

            const fcpStatus = getStatus(fcp, 1800, 3000);
            const lcpStatus = getStatus(lcp, 2500, 4000);
            const clsStatus = getStatus(cls, 0.1, 0.25);

            return (
              <Box key={idx} sx={{ mb: 2, p: 2, background: '#f9f9f9', borderRadius: 2 }}>
                {rows.length > 1 && (
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>{row.url}</Typography>
                )}
                <Typography>
                  <b>FCP:</b> <span style={{ color: fcpStatus.color }}>{row.data1} ms ({fcpStatus.status})</span>
                  {fcpStatus.status !== 'Good' && ' - Try reducing render-blocking resources.'}
                </Typography>
                <Typography>
                  <b>LCP:</b> <span style={{ color: lcpStatus.color }}>{row.data2} ms ({lcpStatus.status})</span>
                  {lcpStatus.status !== 'Good' && ' - Optimize images and server response times.'}
                </Typography>
                <Typography>
                  <b>CLS:</b> <span style={{ color: clsStatus.color }}>{row.data3} ({clsStatus.status})</span>
                  {clsStatus.status !== 'Good' && ' - Avoid layout shifts by setting size attributes on images and ads.'}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

export default App;