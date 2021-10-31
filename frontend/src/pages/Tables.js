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
  const [pageTable2, setPageTable2] = useState(1);

  // setup data for every table
  const [dataTable1, setDataTable1] = useState([]);
  const [dataTable2, setDataTable2] = useState([]);

  const [dataset, setDataset] = useState([]);

  const [checkedFeatures, setCheckedFeatures] = useState(new Set());

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = dataset.length - 1;

  // pagination change control
  function onPageChangeTable1(p) {
    setPageTable1(p);
  }

  // pagination change control
  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setDataTable1(
      response.slice(
        (pageTable1 - 1) * resultsPerPage,
        pageTable1 * resultsPerPage
      )
    );
  }, [pageTable1]);

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setDataTable2(
      response2.slice(
        (pageTable2 - 1) * resultsPerPage,
        pageTable2 * resultsPerPage
      )
    );
  }, [pageTable2]);

  const updateDataset = (newDataset) => {
    const parsedData = newDataset.map((datapoint) => datapoint.data);
    console.log(parsedData);
    setCheckedFeatures(new Set(parsedData[0]));
    setDataset(parsedData);
  };

  return (
    <>
      <PageTitle>Datasets</PageTitle>

      <CTA />

      <CSVReader2 updateDataset={(dataset) => updateDataset(dataset)} />

      <SectionTitle>Dataset Features</SectionTitle>
      <TableContainer className="mb-8 p-4">
        <TableHeader>

            {dataset[0] &&
              dataset[0].map((feature, index) => (
                <label className="inline-flex items-center">
                  <Input type="checkbox" checked={checkedFeatures.has(feature)} />
                  <TableCell className="pl-1" key={index}>
                    {feature}
                  </TableCell>
                </label>
              ))}

        </TableHeader>
      </TableContainer>

      <SectionTitle>Filtered Dataset</SectionTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell key={"rowNum"}>#</TableCell>

              {dataset[0] &&
                dataset[0].map((feature, index) => (
                  <TableCell key={index}>{feature}</TableCell>
                ))}
            </tr>
          </TableHeader>
          <TableBody>
            {dataset &&
              dataset.slice(1, 11).map((columnArray, colIndex) => (
                <TableRow key={colIndex + "_col"}>
                  <TableCell className="bg-gray-50">
                    <span key={colIndex + "_rowNum"} className="text-sm">
                      {colIndex + 1}
                    </span>
                  </TableCell>
                  {columnArray.map((row, rowIndex) => (
                    <TableCell>
                      <span
                        key={colIndex + "_" + rowIndex + "_row"}
                        className="text-sm"
                      >
                        {row}
                      </span>
                    </TableCell>
                  ))}
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
  );
}

export default Tables;
