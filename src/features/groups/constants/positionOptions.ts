export const POSITION_OPTIONS = [
  // 👩‍💻 개발 / 기술
  { value: "software_engineer_frontend_web_ui", label: "프론트엔드 개발자" },
  { value: "software_engineer_backend_server_api", label: "백엔드 개발자" },
  { value: "software_engineer_fullstack_web", label: "풀스택 개발자" },
  { value: "software_engineer_mobile_ios_swift", label: "iOS 개발자" },
  { value: "software_engineer_mobile_android_kotlin", label: "Android 개발자" },
  { value: "software_engineer_mobile_crossplatform_flutter_reactnative", label: "Flutter / React Native 개발자" },
  { value: "engineer_devops_cicd_automation", label: "DevOps 엔지니어" },
  { value: "engineer_cloud_infrastructure_aws_gcp_azure", label: "클라우드 엔지니어" },
  { value: "engineer_sre_reliability_monitoring", label: "SRE (Site Reliability Engineer)" },
  { value: "engineer_security_infosec_cybersecurity", label: "보안 엔지니어" },
  { value: "engineer_qa_testing_quality_assurance", label: "QA 엔지니어" },
  { value: "software_engineer_embedded_firmware_hardware", label: "임베디드 개발자" },
  { value: "software_engineer_game_unity_unreal", label: "게임 개발자" },
  { value: "software_engineer_blockchain_web3_smartcontract", label: "블록체인 개발자" },

  // 📊 데이터 / AI
  { value: "analyst_data_sql_visualization_insight", label: "데이터 분석가" },
  { value: "engineer_data_pipeline_etl_warehouse", label: "데이터 엔지니어" },
  { value: "scientist_data_statistics_modeling_research", label: "데이터 사이언티스트" },
  { value: "engineer_ml_machine_learning_model_deployment", label: "머신러닝 엔지니어" },
  { value: "researcher_ai_deep_learning_nlp_cv", label: "AI 연구원" },
  { value: "analyst_bi_business_intelligence_dashboard", label: "BI 분석가" },

  // 🧭 기획 / 제품
  { value: "manager_product_roadmap_strategy_stakeholder", label: "프로덕트 매니저 (PM)" },
  { value: "owner_product_backlog_agile_scrum", label: "프로덕트 오너 (PO)" },
  { value: "planner_service_ux_requirements_specification", label: "서비스 기획자" },
  { value: "planner_game_level_system_balance", label: "게임 기획자" },
  { value: "analyst_business_process_requirements_documentation", label: "비즈니스 분석가 (BA)" },
  { value: "manager_project_pmo_timeline_resource", label: "PMO / 프로젝트 매니저" },

  // 🎨 디자인
  { value: "designer_ui_visual_interface_component", label: "UI 디자이너" },
  { value: "designer_ux_research_usability_wireframe", label: "UX 디자이너" },
  { value: "designer_product_end_to_end_design_system", label: "프로덕트 디자이너" },
  { value: "designer_graphic_visual_print_digital", label: "그래픽 디자이너" },
  { value: "designer_brand_identity_ci_bi", label: "BI / 브랜드 디자이너" },
  { value: "designer_motion_animation_aftereffects", label: "모션 디자이너" },
  { value: "editor_video_premiere_finalcut_content", label: "영상 편집자" },
  { value: "designer_3d_modeling_rendering_blender", label: "3D 디자이너" },
  { value: "artist_illustration_drawing_character", label: "일러스트레이터" },

  // 📣 마케팅 / 콘텐츠
  { value: "manager_marketing_strategy_campaign_planning", label: "마케팅 매니저" },
  { value: "marketer_performance_paid_ads_roas_analytics", label: "퍼포먼스 마케터" },
  { value: "marketer_growth_acquisition_retention_ab_test", label: "그로스 마케터" },
  { value: "marketer_brand_positioning_awareness_storytelling", label: "브랜드 마케터" },
  { value: "marketer_content_blog_seo_editorial", label: "콘텐츠 마케터" },
  { value: "writer_copy_advertising_messaging_creative", label: "카피라이터" },
  { value: "marketer_sns_social_media_instagram_tiktok", label: "SNS 마케터" },
  { value: "manager_community_engagement_moderation_user", label: "커뮤니티 매니저" },
  { value: "manager_pr_public_relations_media_press", label: "PR / 홍보 담당자" },
  { value: "marketer_crm_email_lifecycle_segmentation", label: "CRM 마케터" },

  // 💼 경영 / 전략 / 운영
  { value: "executive_ceo_leadership_vision_decision", label: "CEO / 대표이사" },
  { value: "executive_coo_operations_efficiency_process", label: "COO / 운영 총괄" },
  { value: "executive_cfo_finance_investment_fundraising", label: "CFO / 재무 총괄" },
  { value: "executive_cto_technology_architecture_engineering", label: "CTO / 기술 총괄" },
  { value: "manager_strategy_business_planning_analysis", label: "경영 전략 / 사업 기획" },
  { value: "manager_bizdev_partnership_expansion_negotiation", label: "사업 개발 (BD)" },
  { value: "planner_new_business_opportunity_market_research", label: "신사업 기획" },
  { value: "manager_operations_workflow_coordination", label: "운영 매니저" },
  { value: "specialist_service_operations_support_issue", label: "서비스 운영" },
  { value: "manager_logistics_scm_supply_chain_inventory", label: "물류 / SCM 담당자" },

  // 💰 재무 / 회계 / 투자
  { value: "manager_finance_budgeting_forecasting_reporting", label: "재무 담당자" },
  { value: "specialist_accounting_bookkeeping_financial_statements", label: "회계 담당자" },
  { value: "specialist_tax_compliance_filing_regulation", label: "세무 담당자" },
  { value: "manager_ir_investor_relations_communication", label: "IR 담당자" },
  { value: "analyst_investment_due_diligence_valuation", label: "투자 심사역" },
  { value: "analyst_vc_venture_capital_portfolio_startup", label: "VC 애널리스트" },

  // ⚖️ 법무 / 컴플라이언스
  { value: "manager_legal_contract_review_negotiation", label: "법무 담당자" },
  { value: "lawyer_corporate_inhouse_litigation_advisory", label: "사내 변호사" },
  { value: "specialist_compliance_regulation_policy_audit", label: "컴플라이언스 담당자" },
  { value: "manager_ip_patent_trademark_intellectual_property", label: "지식재산권 (IP) 담당자" },
  { value: "specialist_contract_management_documentation", label: "계약 관리 담당자" },

  // 🧑‍🤝‍🧑 HR / 인사 / 조직문화
  { value: "manager_hr_human_resources_policy_employee", label: "인사 담당자 (HR)" },
  { value: "specialist_recruiter_hiring_sourcing_interview", label: "채용 담당자 / 리크루터" },
  { value: "specialist_tech_recruiter_engineering_hiring", label: "테크 리크루터" },
  { value: "partner_hrbp_business_hr_strategy_consulting", label: "HRBP" },
  { value: "specialist_compensation_benefits_performance_evaluation", label: "보상 / 평가 담당자" },
  { value: "specialist_hr_ops_payroll_administration", label: "HR 운영 / 급여 담당자" },
  { value: "specialist_org_culture_engagement_wellness", label: "조직문화 담당자" },
  { value: "specialist_learning_development_training_education", label: "교육 / L&D 담당자" },

  // 💬 영업 / 세일즈
  { value: "manager_sales_team_revenue_target_coaching", label: "영업 매니저" },
  { value: "representative_sales_b2b_b2c_closing", label: "영업 담당자" },
  { value: "specialist_inside_sales_phone_email_remote", label: "인사이드 세일즈" },
  { value: "specialist_field_sales_onsite_meeting_presentation", label: "필드 세일즈" },
  { value: "specialist_enterprise_sales_large_account_complex", label: "엔터프라이즈 세일즈" },
  { value: "engineer_sales_technical_demo_solution_presales", label: "세일즈 엔지니어 / SE" },
  { value: "manager_partnership_alliance_channel_collaboration", label: "파트너십 / 제휴 담당자" },
  { value: "manager_account_client_relationship_retention", label: "어카운트 매니저 (AM)" },
  { value: "manager_key_account_strategic_client_vip", label: "Key Account 매니저" },

  // 🎧 고객 서비스 / 지원
  { value: "manager_cs_customer_service_team_quality", label: "CS 매니저" },
  { value: "agent_cs_customer_support_inquiry_resolution", label: "고객 상담원" },
  { value: "manager_customer_success_onboarding_adoption_churn", label: "고객 성공 매니저 (CSM)" },
  { value: "engineer_technical_support_troubleshooting_issue", label: "기술 지원 엔지니어" },
  { value: "analyst_voc_voice_of_customer_feedback_insight", label: "VOC 분석가" },

  // 📚 교육 / 연구
  { value: "instructor_trainer_teaching_workshop_facilitation", label: "강사 / 트레이너" },
  { value: "developer_curriculum_course_content_instructional", label: "커리큘럼 개발자" },
  { value: "researcher_academic_study_analysis_publication", label: "연구원" },
  { value: "engineer_rnd_research_development_innovation", label: "R&D 엔지니어" },

  // 🏭 제조 / 엔지니어링
  { value: "engineer_mechanical_design_cad_manufacturing", label: "기계 엔지니어" },
  { value: "engineer_electrical_electronics_circuit_pcb", label: "전기 / 전자 엔지니어" },
  { value: "specialist_manufacturing_production_assembly_line", label: "생산 / 제조 담당자" },
  { value: "engineer_quality_control_inspection_testing", label: "품질 관리 (QC) 엔지니어" },
  { value: "engineer_process_optimization_efficiency_lean", label: "공정 엔지니어" },

  // 🏥 의료 / 헬스케어
  { value: "researcher_clinical_trial_study_protocol_medical", label: "임상 연구원" },
  { value: "writer_medical_scientific_documentation_regulatory", label: "메디컬 라이터" },
  { value: "consultant_healthcare_hospital_medical_advisory", label: "헬스케어 컨설턴트" },
  { value: "professional_pharmacist_medication_dispensing", label: "약사" },
  { value: "professional_nurse_patient_care_clinical", label: "간호사" },

  // 🏢 기타 전문직
  { value: "consultant_management_strategy_advisory_problem_solving", label: "컨설턴트" },
  { value: "analyst_general_research_report_insights", label: "애널리스트" },
  { value: "specialist_translator_interpreter_language_localization", label: "번역가 / 통역사" },
  { value: "assistant_secretary_scheduling_coordination_admin", label: "비서 / 사무 보조" },
  { value: "specialist_admin_general_affairs_facility_support", label: "총무 / 경영 지원" },
  { value: "trainee_intern_learning_entry_level_junior", label: "인턴" },
  { value: "contractor_freelancer_project_based_independent", label: "프리랜서 / 계약직" },
];
