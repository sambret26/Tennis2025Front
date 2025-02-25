import React, { useState, useEffect } from "react";
import { Button, Card, Switch, Col, Form, Input, InputNumber, Row, Select, Space, Typography } from "antd";
import { getCompetitions, updateCompetition } from "../../api/competitionService";
import { getPredefinedReductions, updatePredefinedReductions} from "../../api/reductionSettingsService";
import { getSettings, updatePrices, updateBatchsActive, updateMojaSync, updateCalendarSync } from "../../api/settingsService";
import Loader from "../Loader/Loader";
import TransparentLoader from "../Loader/TransparentLoader";
import './Settings.css';

const { Title } = Typography;
const { Option } = Select;

const Settings = ({ setGlobalSuccessMessage, setGlobalErrorMessage }) => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [batchsEnabled, setBatchsEnabled] = useState(false);
  const [mojaSyncEnabled, setMojaSyncEnabled] = useState(false);
  const [calendarSyncEnabled, setCalendarSyncEnabled] = useState(false);
  const [simplePrice, setSimplePrice] = useState(0);
  const [doublePrice, setDoublePrice] = useState(0);
  const [reductions, setReductions] = useState([]);
  const [newReductionReason, setNewReductionReason] = useState("");
  const [newReductionAmount, setNewReductionAmount] = useState(0);
  const [isPricesChanged, setIsPricesChanged] = useState(false);
  const [isReductionsChanged, setIsReductionsChanged] = useState(false);
  const [isCompetitionChanged, setIsCompetitionChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransparentLoading, setIsTransparentLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const competitionsData = await getCompetitions();
        setCompetitions(competitionsData);
        if (competitionsData.length > 0) {
          setSelectedCompetition(competitionsData[0].id);
        }

        const reductionsData = await getPredefinedReductions();
        setReductions(reductionsData);

        const settingsData = await getSettings();
        setBatchsEnabled(settingsData.batchsActive === "1");
        setMojaSyncEnabled(settingsData.mojaSync === "1");
        setCalendarSyncEnabled(settingsData.calendarSync === "1");
        setSimplePrice(parseInt(settingsData.simplePrice));
        setDoublePrice(parseInt(settingsData.doublePrice));

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCompetitionChange = (value) => {
    setSelectedCompetition(value);
    setIsCompetitionChanged(true);
  };

  const handleBatchToggle = (checked) => {
    setBatchsEnabled(checked);
    checked ? updateBatchsActive("1") : updateBatchsActive("0");
  };

  const handleMojaSyncToggle = (checked) => {
    setMojaSyncEnabled(checked);
    checked ? updateMojaSync("1") : updateMojaSync("0");
  };

  const handleCalendarSyncToggle = (checked) => {
    setCalendarSyncEnabled(checked);
    checked ? updateCalendarSync("1") : updateCalendarSync("0");
  };

  const handleSimplePriceChange = (value) => {
    setSimplePrice(value);
    setIsPricesChanged(true);
  };

  const handleDoublePriceChange = (value) => {
    setDoublePrice(value);
    setIsPricesChanged(true);
  };

  const handleAddReduction = async () => {
    const isReasonAlreadyExists = reductions.some(
      (reduction) => reduction.reason === newReductionReason
    );

    if (isReasonAlreadyExists) {
      setGlobalErrorMessage("Une réduction avec ce motif existe déjà.");
      return;
    }

    if (newReductionReason && newReductionAmount) {
      const newReduction = {
        reason: newReductionReason,
        amount: newReductionAmount,
      };
      setReductions([...reductions, newReduction]);
      setNewReductionReason("");
      setNewReductionAmount(0);
      setIsReductionsChanged(true);
    }
  };

  const handleUpdateReduction = async (reason, updatedReduction) => {
    setReductions(reductions.map((r) => (r.reason === reason ? updatedReduction : r)));
    setIsReductionsChanged(true);
  };

  const handleDeleteReduction = async (reason) => {
    setReductions(reductions.filter((r) => r.reason !== reason));
    setIsReductionsChanged(true);
  };

  const saveSettings = async () => {
    setIsTransparentLoading(true);
    try {
      if (isPricesChanged) {
        const prices = {
          simplePrice,
          doublePrice,
        };
        await updatePrices(prices);
        setIsPricesChanged(false);
      }
      if (isReductionsChanged) {
        await updatePredefinedReductions(reductions);
        setIsReductionsChanged(false);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsTransparentLoading(false);
    }
  };

  const saveCompetition = async () => {
    await updateCompetition({ competitionId: selectedCompetition }); //TODO : Work
    setIsCompetitionChanged(false);
  };

  const getReductionAmountValue = () => {
    return newReductionAmount > 0 ? newReductionAmount : 'Montant';
  };

  const getInputClassName = () => {
    return newReductionAmount > 0 ? 'settings-input-number' : 'settings-input-number settings-input-number-zero';
  };

  if (isLoading) {
    return <Loader message="Chargement des paramètres..." />;
  }

  return (
    <div className="settings-container">
      <Title level={2} className="settings-title">
        Paramétrage
      </Title>

      <Card title="Sélection de la compétition">
        <Form layout="vertical">
          <Row gutter={16} align="middle">
            <Col span={18}>
              <Form.Item label="Sélectionnez une compétition :">
                <Select
                  value={selectedCompetition}
                  onChange={handleCompetitionChange}
                  className="settings-select"
                >
                  {competitions.map((competition) => (
                    <Option key={competition.id} value={competition.id}>
                      {competition.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                disabled={!isCompetitionChanged}
                onClick={saveCompetition}
                className="settings-button"
              >
                Mettre à jour l'application
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="Options">
        <Row gutter={16}>
          <Col span={8}>
          <Form.Item label="Activer les batchs">
            <Switch
              checked={batchsEnabled}
              onChange={handleBatchToggle}
            />
          </Form.Item>
          </Col>
          <Col span={8}>
          <Form.Item label="Synchroniser MOJA">
            <Switch
              checked={mojaSyncEnabled}
              onChange={handleMojaSyncToggle}
            />
          </Form.Item>
          </Col>
          <Col span={8}>
          <Form.Item label="Synchroniser le calendrier">
            <Switch
              checked={calendarSyncEnabled}
              onChange={handleCalendarSyncToggle}
            />
          </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Paramétrage des prix">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Prix Simple :">
              <InputNumber
                value={simplePrice}
                onChange={handleSimplePriceChange}
                className="settings-input-number"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Prix Double :">
              <InputNumber
                value={doublePrice}
                onChange={handleDoublePriceChange}
                className="settings-input-number"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="Gestion des réductions">
        <Space direction="vertical" className="settings-space">
          {reductions.map((reduction) => (
            <Row key={reduction.reason} gutter={16} align="middle">
              <Col span={10}>
                <Input
                  value={reduction.reason}
                  onChange={(e) =>
                    handleUpdateReduction(reduction.reason, {
                      ...reduction,
                      reason: e.target.value,
                    })
                  }
                />
              </Col>
              <Col span={10}>
                <InputNumber
                  value={reduction.amount}
                  onChange={(value) =>
                    handleUpdateReduction(reduction.reason, {
                      ...reduction,
                      amount: value,
                    })
                  }
                  className="settings-input-number"
                />
              </Col>
              <Col span={4}>
                <Button
                  danger
                  onClick={() => handleDeleteReduction(reduction.reason)}
                >
                  Supprimer
                </Button>
              </Col>
            </Row>
          ))}
          <Row gutter={16} align="middle">
            <Col span={10}>
              <Input
                placeholder="Motif"
                value={newReductionReason}
                onChange={(e) => setNewReductionReason(e.target.value)}
              />
            </Col>
            <Col span={10}>
              <InputNumber
                placeholder="Montant"
                value={getReductionAmountValue()}
                onChange={(value) => setNewReductionAmount(value)}
                className={getInputClassName()}
              />
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={handleAddReduction}>
                Ajouter
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>

      <Button
        type="primary"
        disabled={!isPricesChanged && !isReductionsChanged}
        onClick={saveSettings}
        className="settings-button save-settings-button"
      >
        Enregistrer les paramètres
      </Button>

      {/* Loader */}
      {isTransparentLoading && <TransparentLoader message="Sauvegarde des paramètres..." />}
    </div>
  );
};

export default Settings;