import uuid
from datetime import datetime
from .. import db, ma

class AuditLog(db.Model):
    """审核日志模型"""
    __tablename__ = 'logs'
    
    log_id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    achievement_id = db.Column(db.String(36), db.ForeignKey('achievements.achievement_id'), nullable=False)
    auditor_id = db.Column(db.String(36), db.ForeignKey('users.user_id'), nullable=False)
    action = db.Column(db.Enum('approve', 'return', 'reject', name='audit_actions'), nullable=False)
    comment = db.Column(db.Text, nullable=True)  # 审核意见
    audit_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """转换为字典"""
        return {
            'log_id': self.log_id,
            'achievement_id': self.achievement_id,
            'auditor_id': self.auditor_id,
            'auditor_name': self.auditor.name if self.auditor else None,
            'action': self.action,
            'action_display': self.action_display,
            'comment': self.comment,
            'audit_time': self.audit_time.isoformat() if self.audit_time else None
        }
    
    @property
    def action_display(self):
        """操作显示名称"""
        action_map = {
            'approve': '通过',
            'return': '退回',
            'reject': '拒绝'
        }
        return action_map.get(self.action, self.action)
    
    def __repr__(self):
        return f'<AuditLog {self.action} by {self.auditor.name if self.auditor else "Unknown"}>'

# AuditLogSchema 移到单独的文件中以避免循环依赖