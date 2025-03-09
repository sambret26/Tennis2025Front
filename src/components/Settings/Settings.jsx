import React, { useState, useEffect, useContext } from "react";
import { Button, Card, Switch, Col, Form, Input, InputNumber, Row, Select, Space, Typography } from "antd";
import { getCompetitions, updateCompetition } from "../../api/competitionService";
import { getPredefinedReductions, updatePredefinedReductions} from "../../api/reductionSettingsService";
import { getSettings, updatePrices, updateBatchsActive, updateMojaSync, updateCalendarSync } from "../../api/settingsService";
import { GlobalContext } from '../../App';
import Loader from "../Loader/Loader";
import TransparentLoader from "../Loader/TransparentLoader";
import './Settings.css';

const { Title } = Typography;
const { Option } = Select;

const Settings = ({ setSettingError, setReload }) => {
  const { setGlobalErrorMessage, setGlobalSuccessMessage } = useContext(GlobalContext);

  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [batchsEnabled, setBatchsEnabled] = useState(false);
  const [mojaSyncEnabled, setMojaSyncEnabled] = useState(false);
  const [calendarSyncEnabled, setCalendarSyncEnabled] = useState(false);
  const [simplePrice, setSimplePrice] = useState(0);
  const [doublePrice, setDoublePrice] = useState(0);
  const [simpleInitialPrice, setSimpleInitialPrice] = useState(0);
  const [doubleInitialPrice, setDoubleInitialPrice] = useState(0);
  const [initialCompetition, setInitialCompetition] = useState(0);
  const [reductions, setReductions] = useState([]);
  const [newReductionReason, setNewReductionReason] = useState("");
  const [newReductionAmount, setNewReductionAmount] = useState(0);
  const [hasReductionsChanged, setHasReductionsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransparentLoading, setIsTransparentLoading] = useState(false);
  const [editingReduction, setEditingReduction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const competitionsData = await getCompetitions();
        setCompetitions(competitionsData);
        const activeCompetition = competitionsData.find(c => c.isActive === true);
        if (activeCompetition) {
          setSelectedCompetition(activeCompetition.id);
          setInitialCompetition(activeCompetition.id);
        }

        const reductionsData = await getPredefinedReductions();
        for (const reduction of reductionsData) {
          reduction.key = reduction.reason;
        }
        setReductions(reductionsData);

        const settingsData = await getSettings();
        setBatchsEnabled(settingsData.batchsActive === "1");
        setMojaSyncEnabled(settingsData.mojaSync === "1");
        setCalendarSyncEnabled(settingsData.calendarSync === "1");
        setSimplePrice(parseInt(settingsData.simplePrice));
        setDoublePrice(parseInt(settingsData.doublePrice));
        setSimpleInitialPrice(parseInt(settingsData.simplePrice));
        setDoubleInitialPrice(parseInt(settingsData.doublePrice));

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCompetitionChange = (value) => {
    setSelectedCompetition(value);
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
  };

  const handleDoublePriceChange = (value) => {
    setDoublePrice(value);
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
        key: newReductionReason,
        reason: newReductionReason,
        amount: newReductionAmount,
      };
      setReductions([...reductions, newReduction]);
      setNewReductionReason("");
      setNewReductionAmount(0);
      setHasReductionsChanged(true);
    }
  };

  const handleUpdateReduction = async (key, updatedReduction) => {
    updatedReduction.key = updatedReduction.reason;
    setReductions(reductions.map((r) => (r.key === key ? updatedReduction : r)));
    setHasReductionsChanged(true);
  };

  const handleDeleteReduction = async (key) => {
    setReductions(reductions.filter((r) => r.key !== key));
    setHasReductionsChanged(true);
  };

  const hasPricesChanged = () => {
    return simplePrice !== simpleInitialPrice || doublePrice !== doubleInitialPrice;
  };

  const saveSettings = async () => {
    setIsTransparentLoading(true);
    try {
      if (hasPricesChanged()) {
        const prices = {
          simplePrice,
          doublePrice,
        };
        await updatePrices(prices);
        setSimpleInitialPrice(simplePrice);
        setDoubleInitialPrice(doublePrice);
      }
      if (hasReductionsChanged) {
        await updatePredefinedReductions(reductions);
        setHasReductionsChanged(false);
      }
      setGlobalSuccessMessage("Les modifications ont été enregistrées.");
    } catch (error) {
      console.error("Error saving settings:", error);
      setGlobalErrorMessage("Une erreur est survenue lors de l'enregistrement des modifications.");
    } finally {
      setIsTransparentLoading(false);
    }
  };

  const saveCompetition = async () => {
    await updateCompetition({ competitionId: selectedCompetition });
    setInitialCompetition(selectedCompetition);
    setGlobalSuccessMessage("La compétition a été mise à jour.");
    setSettingError(false);
    setReload(true);
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
                disabled={initialCompetition === selectedCompetition}
                onClick={saveCompetition}
                className="settings-button"
              >
                Mettre à jour la compétition
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
            <Row key={reduction.key} gutter={16} align="middle">
              <Col span={10}>
                <Input
                  value={editingReduction?.key === reduction.key ? editingReduction?.reason : reduction.reason}
                  onChange={(e) => {
                    setHasReductionsChanged(true);
                    setEditingReduction({
                      key: reduction.key,
                      reason: e.target.value,
                    });
                  }}
                  onBlur={() => {
                    if (editingReduction?.key === reduction.key) {
                        handleUpdateReduction(reduction.key, {
                            reason: editingReduction.reason || reduction.reason,
                            amount: reduction.amount,
                        });
                        setEditingReduction(null);
                    }
                }}
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
              <Button type="primary" onClick={handleAddReduction} className="add-reduction-button">
                Ajouter
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>

      <Button
        type="primary"
        disabled={!hasPricesChanged() && !hasReductionsChanged}
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