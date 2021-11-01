import React, { useState, useEffect } from "react";

import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import CTA from "../components/CTA";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Input,
  Pagination,
} from "@windmill/react-ui";
import { EditIcon, TrashIcon } from "../icons";

import response from "../utils/demo/tableData";
import CSVReader2 from "../components/Datasets/CSVReader2";
// make a copy of the data, for the second table
const response2 = response.concat([]);

function Tables() {
  /**
   * DISCLAIMER: This code could be badly improved, but for the sake of the example
   * and readability, all the logic for both table are here.
   * You would be better served by dividing each table in its own
   * component, like Table(?) and TableWithActions(?) hiding the
   * presentation details away from the page view.
   */

  // setup pages control for every table
  const [pageTable1, setPageTable1] = useState(1);

  const [dataset, setDataset] = useState([]);
  const [pagedDataset, setPagedDataset] = useState([]);

  const [features, setFeatures] = useState([]);
  const [checkedFeatures, setCheckedFeatures] = useState({});

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = dataset.length - 1;

  // pagination change control
  function onPageChangeTable1(p) {
    setPageTable1(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setPagedDataset(
      dataset.slice(
        (pageTable1 - 1) * resultsPerPage,
        pageTable1 * resultsPerPage
      )
    );
    console.log(
      dataset.slice(
        (pageTable1 - 1) * resultsPerPage,
        pageTable1 * resultsPerPage
      )
    );
  }, [pageTable1]);

  const updateDataset = (newDataset) => {
    if(newDataset.length < 1) {
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
                        {colIndex + 1 + (pageTable1-1)*10}
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
                onChange={onPageChangeTable1}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </>
      )}
    </>
  );
}

export default Tables;
