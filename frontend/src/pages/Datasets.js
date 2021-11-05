import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Input,
  Pagination,
} from "@windmill/react-ui";

import CSVReader2 from "../components/Datasets/CSVReader2";

function Datasets() {
  // setup pages control for every lo
  const [pageTable, setPageTable] = useState(1);

  const [dataset, setDataset] = useState([]);
  const [pagedDataset, setPagedDataset] = useState([]);

  const [features, setFeatures] = useState([]);
  const [checkedFeatures, setCheckedFeatures] = useState({});

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = dataset.length - 1;

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setPagedDataset(
      dataset.slice(
        (pageTable - 1) * resultsPerPage,
        pageTable * resultsPerPage
      )
    );
    console.log(
      dataset.slice(
        (pageTable - 1) * resultsPerPage,
        pageTable * resultsPerPage
      )
    );
  }, [pageTable]);

  const updateDataset = (newDataset) => {
    if (newDataset.length < 1) {
      setDataset([]);
      setFeatures([]);
      setCheckedFeatures({});
      setPagedDataset([]);
      return;
    }
    const parsedData = newDataset.map((datapoint) => datapoint.data);
    setDataset(parsedData.slice(1));
    const parsedFeatures = parsedData[0].reduce(
      (o, key, i) => ({ ...o, [key]: true, [i]: true }),
      {}
    );
    setFeatures(parsedData[0]);
    setCheckedFeatures(parsedFeatures);
    setPagedDataset(parsedData.slice(1, 11));
  };

  const updateCheckedFeatures = (feature, index) => {
    console.log({
      ...checkedFeatures,
      [feature]: !checkedFeatures[feature],
      [index]: !checkedFeatures[index],
    });
    setCheckedFeatures({
      ...checkedFeatures,
      [feature]: !checkedFeatures[feature],
      [index]: !checkedFeatures[index],
    });
  };

  return (
    <>
      <PageTitle>Datasets</PageTitle>

      <CSVReader2 updateDataset={(dataset) => updateDataset(dataset)} />

      {features.length > 0 && (
        <>
          <SectionTitle>Dataset Features</SectionTitle>
          <TableContainer className="mb-8 p-4">
            <TableHeader>
              {features.map((feature, index) => (
                <label className="inline-flex items-center">
                  <Input
                    type="checkbox"
                    checked={checkedFeatures[feature]}
                    onChange={() => updateCheckedFeatures(feature, index)}
                  />
                  <TableCell
                    className={`pl-1 ${
                      !checkedFeatures[feature] && "text-gray-400"
                    }`}
                    key={index}
                  >
                    {feature}
                  </TableCell>
                </label>
              ))}
            </TableHeader>
          </TableContainer>
        </>
      )}

      {pagedDataset.length > 0 && (
        <>
          <SectionTitle>Filtered Dataset</SectionTitle>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell key={"rowNum"}>#</TableCell>

                  {features &&
                    features.map(
                      (feature, index) =>
                        checkedFeatures[feature] && (
                          <TableCell key={index}>{feature}</TableCell>
                        )
                    )}
                </tr>
              </TableHeader>
              <TableBody>
                {pagedDataset.map((columnArray, colIndex) => (
                  <TableRow key={colIndex + "_col"}>
                    <TableCell className="bg-gray-50 dark:bg-gray-700">
                      <span
                        key={colIndex + "_rowNum"}
                        className="text-sm text-gray-400"
                      >
                        {colIndex + 1 + (pageTable - 1) * 10}
                      </span>
                    </TableCell>
                    {columnArray.map(
                      (rowValue, rowIndex) =>
                        checkedFeatures[rowIndex] && (
                          <TableCell>
                            <span
                              key={colIndex + "_" + rowIndex + "_row"}
                              className="text-sm"
                            >
                              {rowValue}
                            </span>
                          </TableCell>
                        )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={onPageChangeTable}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </>
      )}
    </>
  );
}

export default Datasets;
