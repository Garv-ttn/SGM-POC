import { useState, useEffect } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import styles from "./Menu.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import constants from "../../constants";
import { validate } from "../../utils/validate";

const animatedComponents = makeAnimated();

function Menu({
  modalClose,
  setLoading,
  updateToTable,
  appendToTable,
  rowData,
}) {
  const [showTournament, setShowTournament] = useState(false);
  const [type, setType] = useState(rowData.type || constants.POPULAR);
  const [sportData, setSportData] = useState([]);
  const [competiton, setCompetition] = useState([]);
  const [match, setMatch] = useState([]);
  const [tournament, setTournament] = useState([]);
  const [propositions, setPropositions] = useState([]);
  const [selectedPropositions, setSelectedPropositions] = useState(() => {
    if (!rowData?.propositions?.length) return [];
    return rowData.propositions.map((d) => ({
      label: d.name,
      value: d.name,
      propId: d.propId,
    }));
  });

  const [record, setRecord] = useState({
    sportName: rowData.sportName,
    compName: rowData.compName,
    matchId: rowData.matchId,
    matchName: rowData.matchName,
    startTime: rowData.startTime,
    numberOfBets: rowData.numberOfBets || "",
    minLegs: rowData.minLegs || "",
    maxLegs: rowData.maxLegs || "",
    minPrice: rowData.minPrice || "",
    maxPrice: rowData.maxPrice || "",
    tournamentName: rowData.tournamentName || null,
    propositions: rowData.propositions,
    enabled: true || rowData.enabled,
  });

  useEffect(() => {
    async function getterData() {
      setLoading(true);
      const sports = sportData?.find((el) => el.name === record.sportName);
      if (!sports) return setLoading(false);

      setCompetition(sports.competitions);
      if (!record.compName) return setLoading(false);

      const comp = sports.competitions.find(
        (el) => el.name === record.compName
      );

      if (comp?.tournaments?.length > 0) {
        setShowTournament(true);
        setTournament(comp.tournaments);
        if (!record.tournamentName) return setLoading(false);

        const tour = comp.tournaments.find(
          (el) => el.name === record.tournamentName
        );

        // console.log(tour);
        const matches = await getFromMatchesLinks(tour);
        setMatch(matches);
        if (!record.matchId) return setLoading(false);

        const match = matches.find(
          (el) => Number(record.matchId) === el.spectrumUniqueId
        );

        setRecord({ ...record, startTime: match.startTime });

        const markets = await getFromMarketLinks(match);
        setPropositions(getPropositions(markets));
      } else {
        const matches = await getFromMatchesLinks(comp);
        setMatch(matches);

        if (!record.matchId) return setLoading(false);

        const match = matches.find(
          (el) => Number(record.matchId) === el.spectrumUniqueId
        );
        setRecord({ ...record, startTime: match.startTime });

        const markets = await getFromMarketLinks(match);
        setPropositions(getPropositions(markets));
      }

      setLoading(false);
    }
    getterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sportData,
    record.sportName,
    record.compName,
    record.matchId,
    record.tournamentName,
  ]);

  async function getFromMarketLinks(x) {
    try {
      if (process.env.REACT_APP_SERVER_URL) {
        const res = await axios.get(
          process.env.REACT_APP_SERVER_URL + x._links.markets
        );
        return res.data.markets;
      } else {
        const res = await axios.get(x._links.markets);
        return res.data.markets;
      }
    } catch (e) {
      console.log(e.message);
      toast.warning("Please try again later");
    }
  }

  async function getFromMatchesLinks(x) {
    try {
      if (process.env.REACT_APP_SERVER_URL) {
        const res = await axios.get(
          process.env.REACT_APP_SERVER_URL + x._links.matches
        );
        return res.data.matches;
      } else {
        const res = await axios.get(x._links.matches);
        return res.data.matches;
      }
    } catch (e) {
      console.log(e.message);
      toast.warning("Please try again later");
    }
  }

  useEffect(() => {
    const getSportData = async () => {
      setLoading(true);
      const res = await axios.get(constants.REACT_APP_TABCORP_API);
      setSportData(res.data.sports);
      setLoading(false);
    };

    getSportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRadioButton = (e) => {
    setType(e.target.name);

    if (e.target.name === constants.POPULAR) {
      setRecord({
        ...record,
        numberOfBets: rowData.numberOfBets || "",
        minLegs: rowData.minLegs || "",
        maxLegs: rowData.maxLegs || "",
        minPrice: rowData.minPrice || "",
        maxPrice: rowData.maxPrice || "",
        type: e.target.name,
        propositions: [],
      });
      setSelectedPropositions([]);
    }
    if (e.target.name === constants.FEATURED) {
      setRecord({
        ...record,
        type: e.target.name,
        minLegs: null,
        maxLegs: null,
        minPrice: null,
        maxPrice: null,
        numberOfBets: null,
      });
      if (
        record.sportName === rowData.sportName &&
        record.compName === rowData.compName &&
        record.matchName === rowData.matchName
      ) {
        setRecord({
          ...record,
          propositions: rowData.propositions,
        });
        setSelectedPropositions(() => {
          if (!rowData?.propositions?.length) return [];
          return rowData.propositions.map((d) => ({
            label: d.name,
            value: d.name,
            propId: d.propId,
          }));
        });
      }
    }
  };

  const handleCheckbox = (e) => {
    setRecord({ ...record, enabled: e.target.checked });
  };

  const handlePropositions = (e) => {
    const propData = e.map((element) => {
      return {
        name: element.label,
        propId: element.propId,
      };
    });
    setRecord({ ...record, propositions: propData });
    setSelectedPropositions(e);
  };

  const handleSport = (e) => {
    setRecord({
      ...record,
      sportName: e.target.value,
      propositions: [],
      compName: null,
      tournamentName: null,
      matchId: null,
      matchName: null,
      startTime: null,
    });
    setSelectedPropositions([]);
    setPropositions([]);
    setTournament([]);
    setMatch([]);
    setShowTournament(false);
  };

  const handleCompetition = (e) => {
    setRecord({
      ...record,
      compName: e.target.value,
      tournamentName: null,
      matchId: null,
      matchName: null,
      startTime: null,
    });
    setSelectedPropositions([]);
    setPropositions([]);
    setTournament([]);
    setMatch([]);
  };

  const handleTournamnt = (e) => {
    setRecord({
      ...record,
      tournamentName: e.target.value,
      matchId: null,
      matchName: null,
      startTime: null,
    });
    setSelectedPropositions([]);
    setPropositions([]);
    setMatch([]);
  };

  const handleMatch = (e) => {
    const { name, startTime } = match.find(
      (el) => el.spectrumUniqueId === Number(e.target.value)
    );
    setRecord({
      ...record,
      matchId: e.target.value,
      matchName: name,
      startTime: startTime,
      propositions: [],
    });
    setSelectedPropositions([]);
    setPropositions([]);
  };

  function getPropositions(data) {
    const result = [];
    data?.forEach((element) => {
      const { betOption, propositions } = element;
      if (propositions) {
        propositions.forEach((propelement) =>
          result.push({
            value: `${betOption} : ${propelement.name}`,
            label: `${betOption} : ${propelement.name}`,
            propId: propelement.id,
          })
        );
      } else {
        const { markets } = element;
        markets.forEach((marketelement) => {
          const { betOption, propositions } = marketelement;
          propositions.forEach((propelement) =>
            result.push({
              value: `${betOption} : ${propelement.name}`,
              label: `${betOption} : ${propelement.name}`,
              propId: propelement.id,
            })
          );
        });
      }
    });
    return result;
  }

  // Set records
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setRecord({ ...record, [name]: value });
  };

  //Send the records
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const prompt = validate(record, showTournament, type);
      if (prompt.error) {
        return toast.warning(prompt.message);
      }

      if (rowData._id) {
        const result = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/configurations/${rowData._id}`,
          { ...record, type: type }
        );
        toast.success("Record updated successfully");
        updateToTable(result.data);
      } else {
        const result = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/configurations`,
          { ...record, type: type }
        );
        toast.success("Record saved successfully");
        appendToTable(result.data);
      }

      modalClose();
    } catch (e) {
      console.log(e.message);
      toast.error("Error on submission, try again later");
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div className={styles.radiobutton}>
          <span>Type</span>
          <Form.Check
            inline
            label="Popular"
            name={constants.POPULAR}
            type="radio"
            id="inline-radio-1"
            checked={type === constants.POPULAR}
            onChange={handleRadioButton}
            disabled={rowData.type}
          />
          <Form.Check
            inline
            label="Featured"
            name={constants.FEATURED}
            type="radio"
            id="inline-radio-2"
            checked={type === constants.FEATURED}
            onChange={handleRadioButton}
            disabled={rowData.type}
          />
        </div>
        <div>
          <InputGroup className="mb-3">
            <div className={styles.menuheading}>
              Sports
              <Form.Select
                aria-label="Default select example"
                onChange={handleSport}
              >
                {!rowData.sportName && (
                  <option selected disabled>
                    Select Option
                  </option>
                )}
                {sportData?.map((sport) => {
                  const { spectrumId, name } = sport;
                  return (
                    <option
                      value={name}
                      key={spectrumId}
                      selected={record.sportName === name}
                    >
                      {name}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
          </InputGroup>

          <InputGroup className="mb-3">
            <div className={styles.menuheading}>
              Competition
              <Form.Select
                aria-label="Default select example"
                onChange={handleCompetition}
              >
                {!record.compName && (
                  <option selected disabled>
                    Select Option
                  </option>
                )}
                {competiton?.map((competiton) => {
                  const { spectrumId, name } = competiton;
                  return (
                    <option
                      value={name}
                      key={spectrumId}
                      selected={name === record.compName}
                    >
                      {name}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
          </InputGroup>
          {showTournament && (
            <InputGroup className="mb-3">
              <div className={styles.menuheading}>
                Tournament
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleTournamnt}
                >
                  {!record.tournamentName && (
                    <option selected disabled>
                      Select Option
                    </option>
                  )}
                  {tournament?.map((tournament) => {
                    const { spectrumId, name } = tournament;
                    return (
                      <option
                        value={name}
                        key={spectrumId}
                        selected={name === record.tournamentName}
                      >
                        {name}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>
            </InputGroup>
          )}

          <InputGroup className="mb-3">
            <div className={styles.menuheading}>
              Match
              <Form.Select
                aria-label="Default select example"
                onChange={handleMatch}
              >
                {!record.matchId && (
                  <option selected disabled>
                    Select Option
                  </option>
                )}
                {match?.map((match) => {
                  const { spectrumUniqueId, name } = match;
                  return (
                    <option
                      value={spectrumUniqueId}
                      key={spectrumUniqueId}
                      selected={spectrumUniqueId === record.matchId}
                    >
                      {name}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
          </InputGroup>
        </div>

        {/* Type is popular or featured */}

        {type === constants.POPULAR ? (
          <div className={styles.popular}>
            <div>
              <Form.Group
                as={Row}
                className="mb-1"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="7" className={styles.label}>
                  Min No of Bets Placed
                </Form.Label>
                <Col sm="5">
                  <Form.Control
                    type="number"
                    className={styles.input}
                    name="numberOfBets"
                    value={record.numberOfBets}
                    onChange={handleInput}
                    required={true}
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-1"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="7" className={styles.label}>
                  Min No of Legs
                </Form.Label>
                <Col sm="5">
                  <Form.Control
                    type="number"
                    className={styles.input}
                    name="minLegs"
                    value={record.minLegs}
                    onChange={handleInput}
                    required={true}
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-1"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="7" className={styles.label}>
                  Max No of Legs
                </Form.Label>
                <Col sm="5">
                  <Form.Control
                    type="number"
                    className={styles.input}
                    name="maxLegs"
                    value={record.maxLegs}
                    onChange={handleInput}
                    required={true}
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-1"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="7" className={styles.label}>
                  Min Price
                </Form.Label>
                <Col sm="5">
                  <Form.Control
                    type="number"
                    className={styles.input}
                    name="minPrice"
                    value={record.minPrice}
                    onChange={handleInput}
                    required={true}
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-1"
                controlId="formPlaintextEmail"
              >
                <Form.Label column sm="7" className={styles.label}>
                  Max Price
                </Form.Label>
                <Col sm="5">
                  <Form.Control
                    type="number"
                    className={styles.input}
                    name="maxPrice"
                    value={record.maxPrice}
                    onChange={handleInput}
                    required={true}
                  />
                </Col>
              </Form.Group>
            </div>
          </div>
        ) : (
          <div>
            <InputGroup className="mb-3">
              <div className={styles.menuheading}>
                Propositions
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  onChange={handlePropositions}
                  isMulti
                  options={propositions}
                  value={selectedPropositions}
                  placeholder="Select Propositions"
                />
              </div>
            </InputGroup>
          </div>
        )}
        <div className={styles.popular}>
          <Form.Group as={Row} controlId="formBasicCheckbox">
            <div className={styles.checkboxcontainer}>
              <Form.Label
                column
                sm="7"
                className={`${styles.label} ${styles.labelfeatured}`}
              >
                Enabled
              </Form.Label>
              <Col sm="5">
                <Form.Check
                  type="checkbox"
                  className={`${styles.checkboxfeatured}`}
                  onChange={handleCheckbox}
                  checked={record.enabled}
                />
              </Col>
            </div>
          </Form.Group>
        </div>
        <div className={styles.savebuttondiv}>
          <Button className={styles.savebutton} type="submit">
            {rowData._id ? "Update" : "Add"}
          </Button>
        </div>
      </Form>
    </>
  );
}

export default Menu;
