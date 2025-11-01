import uuid
from datetime import datetime, date
from .. import db, ma

class Achievement(db.Model):
    """成果模型"""
    __tablename__ = 'achievements'
    
    achievement_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    type = db.Column(db.Enum('paper', 'competition', 'project', 'honor', name='achievement_types'), nullable=False)
    level = db.Column(db.Enum('school', 'province', 'national', name='achievement_levels'), nullable=False)
    award_date = db.Column(db.Date, nullable=False)
    supervisor = db.Column(db.String(100), nullable=True)  # 指导教师
    members = db.Column(db.JSON, nullable=True)  # 成员名单，存储为JSON数组
    class_id = db.Column(db.String(36), db.ForeignKey('classes.class_id'), nullable=False)
    leader_id = db.Column(db.String(36), db.ForeignKey('users.user_id'), nullable=False)
    submitter_id = db.Column(db.String(36), db.ForeignKey('users.user_id'), nullable=False)  # 提交人
    evidence_files = db.Column(db.JSON, nullable=True)  # 佐证材料文件路径
    status = db.Column(db.Enum('pending', 'approved', 'rejected', 'returned', name='achievement_status'), 
                      default='pending', nullable=False)
    is_public = db.Column(db.Boolean, default=False)  # 是否公开展示
    description = db.Column(db.Text, nullable=True)  # 成果描述
    remarks = db.Column(db.Text, nullable=True)  # 备注
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    class_info = db.relationship('Class', backref='achievements', lazy=True)
    submitter = db.relationship('User', foreign_keys=[submitter_id], backref='submitted_achievements')
    audit_logs = db.relationship('AuditLog', backref='achievement', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self, include_files=False):
        """转换为字典"""
        data = {
            'achievement_id': self.achievement_id,
            'title': self.title,
            'type': self.type,
            'level': self.level,
            'award_date': self.award_date.isoformat() if self.award_date else None,
            'supervisor': self.supervisor,
            'members': self.members,
            'class_id': self.class_id,
            'class_name': self.class_info.class_name if self.class_info else None,
            'leader_id': self.leader_id,
            'leader_name': self.leader.name if self.leader else None,
            'submitter_id': self.submitter_id,
            'submitter_name': self.submitter.name if self.submitter else None,
            'status': self.status,
            'is_public': self.is_public,
            'description': self.description,
            'remarks': self.remarks,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_files:
            data['evidence_files'] = self.evidence_files
            
        return data
    
    @property
    def type_display(self):
        """类型显示名称"""
        type_map = {
            'paper': '论文',
            'competition': '竞赛',
            'project': '项目',
            'honor': '荣誉'
        }
        return type_map.get(self.type, self.type)
    
    @property
    def level_display(self):
        """级别显示名称"""
        level_map = {
            'school': '校级',
            'province': '省部级',
            'national': '国家级'
        }
        return level_map.get(self.level, self.level)
    
    @property
    def status_display(self):
        """状态显示名称"""
        status_map = {
            'pending': '待审核',
            'approved': '已通过',
            'rejected': '已拒绝',
            'returned': '已退回'
        }
        return status_map.get(self.status, self.status)
    
    def to_dict(self):
        """转换为字典格式"""
        return {
            'achievement_id': self.achievement_id,
            'title': self.title,
            'type': self.type,
            'level': self.level,
            'award_date': self.award_date.isoformat() if self.award_date else None,
            'supervisor': self.supervisor,
            'members': self.members if self.members else [],
            'class_id': self.class_id,
            'leader_id': self.leader_id,
            'leader_name': self.leader.name if self.leader else None,
            'submitter_id': self.submitter_id,
            'evidence_files': self.evidence_files if self.evidence_files else [],
            'status': self.status,
            'is_public': self.is_public,
            'description': self.description,
            'remarks': self.remarks,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'type_display': self.type_display,
            'level_display': self.level_display,
            'status_display': self.status_display
        }

    def __repr__(self):
        return f'<Achievement {self.title}>'

# AchievementSchema 移到单独的文件中以避免循环依赖